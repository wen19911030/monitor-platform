const { resDataFormat, getUserInfo } = require('../assets/utils');

module.exports = {
  checkLogin(req, res, next) {
    if (!req.session.user) {
      // 用户未登录，请重新登录
      res.json(resDataFormat(-1));
      return;
    }
    next();
  },

  checkNotLogin(req, res, next) {
    if (req.session.user) {
      // 用户已登录
      res.json(resDataFormat(0, getUserInfo(req.session.user)));
      return;
    }
    next();
  },
};
