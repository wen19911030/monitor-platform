const express = require('express');
const NodeRSA = require('node-rsa');
const appRoot = require('app-root-path');
const fs = require('fs');

const router = express.Router();
const user = require('../models/user.js');
const { resDataFormat, getUserInfo, getRandom } = require('../assets/utils.js');
const sendMail = require('../services/email.js');

const { checkLogin } = require('../middlewares/check');

// rsa加密
let rsaPubKey = null;
fs.readFile(`${appRoot}/assets/rsa_1024_pub.pem`, (
  err,
  data,
) => {
  if (err) {
    console.error(err);
  }
  const pubKey = data.toString();
  rsaPubKey = new NodeRSA(pubKey);
  rsaPubKey.setOptions({ encryptionScheme: 'pkcs1' });
});

// rsa解密
let rsaPrivKey = null;
fs.readFile(`${appRoot}/assets/rsa_1024_priv.pem`, (
  err,
  data,
) => {
  if (err) {
    console.error(err);
  }
  const privKey = data.toString();
  rsaPrivKey = new NodeRSA(privKey);
  rsaPrivKey.setOptions({ encryptionScheme: 'pkcs1' });
});

router.post('/register', (req, res) => {
  user
    .insert(req.body.username, req.body.password, req.body.email)
    .then((result) => {
      // TODO 发送验证邮件
      sendMail(
        result.email,
        '验证邮件',
        `<p>这是来自****网站的验证邮件，请点击链接进行验证<a href="http://47.102.141.180:9999/api/verify/email/${Buffer.from(
          req.body.username,
        ).toString('base64')}">http://47.102.141.180:9999/api/verify/email/${Buffer.from(
          req.body.username,
        ).toString('base64')}</a></p>`,
      ).finally((result1) => {
        console.log(result1);
      });
      const userInfo = {
        username: result.username,
        email: result.email,
      };
      req.session.user = userInfo;
      res.json(resDataFormat(0, userInfo));
    })
    .catch((err) => {
      console.log(err);
      res.json(resDataFormat(1, err));
    });
});

router.post('/login', (req, res) => {
  user.findOne({ username: req.body.username }).then((result) => {
    if (result && result.username) {
      const password = rsaPrivKey.decrypt(req.body.password, 'utf8');
      const oriPassword = rsaPrivKey.decrypt(result.password, 'utf8');
      if (password === oriPassword) {
        // update logintime
        user.update(req.body.username, { logintime: Date.now() });
        // TODO 不能删除对象属性？
        delete result.password;
        const userInfo = {
          username: result.username,
          email: result.email,
        };
        req.session.user = userInfo;
        res.json(resDataFormat(0, userInfo));
      } else {
        res.json(resDataFormat(2));
      }
    } else {
      res.json(resDataFormat(3));
    }
  });
});

router.post('/logout', checkLogin, (req, res) => {
  req.session.user = null;
  res.json(resDataFormat(0));
});

router.get('/getInfo', checkLogin, (req, res) => {
  res.json(resDataFormat(0, getUserInfo(req.session.user)));
});

router.post('/findPassword', (req, res) => {
  user.findOne({ username: req.body.username }).then((result) => {
    if (result && result.username) {
      const newPs = getRandom(8);
      const str = rsaPubKey.encrypt(newPs, 'base64');
      // 更新密码
      const p1 = user.update(req.body.username, { newPs, str });
      // 发送邮件
      const p2 = sendMail(
        result.email,
        '找回密码',
        `<p>新密码为${newPs}，登陆后请尽早更换密码。</p>`,
      );
      Promise.all([p1, p2])
        .then((results) => {
          res.json(resDataFormat(0, {}, `新密码已发送到您的${results[0].email}邮箱里`));
        })
        .catch((err) => {
          // TODO 错误处理，
          // 1：邮件发送成功，密码更新失败
          // 2: 邮件发送失败，密码更新成功
          console.log(err);
          res.json(resDataFormat(1));
        });
    } else {
      res.json(resDataFormat(3));
    }
  });
});

router.post('/changePassword', checkLogin, (req, res) => {
  const userInfo = req.session.user;
  const oldPass = rsaPrivKey.decrypt(req.body.oldPass, 'utf8');
  user.findOne({ username: userInfo.username }).then((result) => {
    if (result && result.username) {
      const pass1 = rsaPrivKey.decrypt(result.password, 'utf8');
      if (oldPass === pass1) {
        user
          .update(userInfo.username, { password: req.body.newPass })
          .then((data) => {
            console.log(data);
            res.json(resDataFormat(0));
          })
          .catch(err => console.log(err));
      } else {
        res.json(resDataFormat(2));
      }
    } else {
      res.json(resDataFormat(3));
    }
  });
});

router.post('/writeOff', checkLogin, (req, res) => {
  user
    .deleteUser({ username: req.session.user.username })
    .then(() => {
      req.session.user = null;
      res.json(resDataFormat(0));
    })
    .catch(err => console.log(err));
});

module.exports = router;
