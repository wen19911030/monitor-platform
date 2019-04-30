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

exports.frequency = function (arr = []) {
  const tuples = arr.map(item => [item, 1]);
  for (let i = 0; i < tuples.length; i += 1) {
    for (let j = i + 1; j < tuples.length; j += 1) {
      if (tuples[i][0] === tuples[j][0]) {
        tuples[i][1] += 1;
      }
    }
  }
  const filterArr = tuples
    .filter((item, i) => arr.indexOf(item[0]) === i)
    .sort((pre, cur) => pre[1] < cur[1]);
  return filterArr;
};
