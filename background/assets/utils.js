const { STATUS } = require('./status.js');

/* eslint-disable func-names */
exports.resDataFormat = function (status = 0, data = {}, msg) {
  const message = msg || STATUS[status];
  return {
    status,
    message,
    data,
  };
};

exports.getUserInfo = function (user = {}) {
  const { username, email } = user;
  return { username, email };
};

exports.getRandom = function (len = 8) {
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < len; i += 1) {
    const n = Math.floor(Math.random() * base.length);
    str += base[n];
  }
  return str;
};
