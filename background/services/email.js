const nodemailer = require('nodemailer');
const config = require('../config/index');

const mailTransport = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: config.email.service, // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: config.email.user,
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: config.email.code,
  },
});

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
const sendMail = (recipient, subject, html, text = '') => {
  const options = {
    from: config.email.user, // '"你的名字" <你的邮箱地址>',
    to: recipient, // '"用户1" <邮箱地址1>, "用户2" <邮箱地址2>',
    subject,
    text,
    html, // '<h1>你好，这是一封来自NodeMailer的邮件！</h1><p><img src="cid:00000001"/></p>'
  };
  return new Promise((resolve, reject) => {
    mailTransport.sendMail(options, (error) => {
      if (error) {
        reject(error);
      }
      resolve('ok');
    });
  });
};

module.exports = sendMail;
