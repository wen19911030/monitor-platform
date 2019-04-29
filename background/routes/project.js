const express = require('express');
const project = require('../models/project.js');
const { resDataFormat } = require('../assets/utils.js');
const { checkLogin } = require('../middlewares/check');

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
      console.log(err);
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
      console.log(result);
      project.findByPageSize(mp, size, page).then((docs) => {
        res.json(resDataFormat(0, {
          total: result.length,
          list: docs,
        }));
      })
        .catch((err) => {
          console.log(err);
          res.json(resDataFormat(1));
        });
    });
});

module.exports = router;
