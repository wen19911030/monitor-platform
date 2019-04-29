const express = require('express');

const router = express.Router();
const user = require('../models/user.js');
const { resDataFormat } = require('../assets/utils.js');

router.get('/email/:username', (req, res) => {
  const username = Buffer.from(req.params.username, 'base64').toString();
  user
    .findOne({ username })
    .then((result) => {
      console.log(result);
      if (result && result.username) {
        if (result.emailIsVerify) {
          res.json(resDataFormat(0, {}, '邮箱验证成功'));
          return;
        }
        user.update(result.username, { emailIsVerify: true }).then(() => {
          res.json(resDataFormat(0, {}, '邮箱验证成功'));
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json(resDataFormat(0, {}, 'email is error'));
    });
});

module.exports = router;
