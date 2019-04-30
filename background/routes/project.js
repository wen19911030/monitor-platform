const express = require('express');
const moment = require('moment');
const project = require('../models/project.js');
const analytics = require('../models/analytics.js');
const { resDataFormat, frequency } = require('../assets/utils.js');
const { checkLogin } = require('../middlewares/check');
const { log } = require('../config/winston');

const router = express.Router();

router.post('/create', checkLogin, (req, res) => {
  const {
    projectName, projectDesc, projectType, creator, noticeType,
  } = req.body;
  project
    .insert(projectName, projectDesc, projectType, creator, noticeType)
    .then((result) => {
      res.json(resDataFormat(0, result));
    })
    .catch((err) => {
      log.error(err);
      res.json(resDataFormat(1));
    });
});

router.post('/list', checkLogin, (req, res) => {
  const size = req.query.size || 20; // 分页参数
  let page = req.query.page || 1; // 当前页码
  // 条件查询参数
  const params = {
    projectName: req.body.projectName,
    projectType: req.body.projectType,
    creator: req.body.creator,
  };
  const mp = {};
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      mp[key] = params[key];
    }
  });
  if (mp.projectType === 'public') {
    delete mp.creator;
  }
  if (page < 1) {
    page = 1;
  }
  project
    .find(mp)
    .then((result) => {
      project.findByPageSize(mp, size, page).then((docs) => {
        res.json(resDataFormat(0, {
          total: result.length,
          list: docs,
        }));
      })
        .catch((err) => {
          log.error(err);
          res.json(resDataFormat(1));
        });
    });
});

router.post('/performance', checkLogin, (req, res) => {
  const { projectId, startTime, endTime } = req.body;
  const start = new Date(moment(startTime).startOf('day').toDate());
  const end = new Date(moment(endTime).endOf('day').toDate());
  analytics.find({
    account: projectId,
    'data.type': 'LOAD_PAGE',
    'data.logInfo.loadType': 'load',
    createtime: {
      $gt: start, $lte: end,
    },
  }).then((result) => {
    const obj = result.map(item => item.data.logInfo).reduce((pre, cur) => ({
      lookupDomain: pre.lookupDomain + cur.lookupDomain,
      connect: pre.connect + cur.connect,
      request: pre.request + cur.request,
      domReady: pre.domReady + cur.domReady,
      loadEvent: pre.loadEvent + cur.loadEvent,
      loadPage: pre.loadPage + cur.loadPage,
    }));
    const data = {};
    Object.keys(obj).forEach((key) => {
      data[key] = obj[key] / result.length;
    });
    res.json(resDataFormat(0, data));
  }).catch((err) => {
    log.error(err);
    res.json(resDataFormat(1));
  });
});

router.post('/analytics', (req, res) => {
  const { projectId } = req.body;
  const start = new Date(moment().startOf('day').toDate());
  const end = new Date(moment().endOf('day').toDate());
  analytics.find({
    account: projectId,
    'data.type': 'CUSTOMER_PV',
    createtime: {
      $gt: start, $lte: end,
    },
  }).then((result) => {
    const pv = result.length;
    const sessionIds = result.map(item => item.sessionId);
    const ips = result.map(item => item.ip);
    const uvList = frequency(sessionIds);
    const ipList = frequency(ips);

    const data = {
      pv,
      uv: uvList.length,
      ip: ipList.length,
    };

    res.json(resDataFormat(0, data));
  }).catch((err) => {
    log.error(err);
    res.json(resDataFormat(1));
  });
});

module.exports = router;
