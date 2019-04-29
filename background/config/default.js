module.exports = {
  port: 9999,
  session: {
    secret: 'monitor',
    key: 'monitor',
    maxAge: 3600000,
  },
  mongodb: 'mongodb://127.0.0.1:27017/monitor',
  email: {
    service: '163',
    user: 'anyijiandan@163.com',
    code: 'WEN1991',
  },
};
