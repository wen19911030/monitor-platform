const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const morgan = require('morgan');
const createError = require('http-errors');

const app = express();
const { reqLog } = require('./config/winston');
const config = require('./config/index');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// session 中间件
app.use(
  session({
    name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
      maxAge: config.session.maxAge, // 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({
      // 将 session 存储到 mongodb
      url: config.mongodb, // mongodb 地址
    }),
  }),
);

morgan.token('username', req => (req.session.user && req.session.user.username));
morgan.token('params', (req) => {
  if (req.method === 'GET') {
    return JSON.stringify(req.query);
  }
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
});

morgan.format('info', '[info] :username :remote-addr ":method :url HTTP/:http-version" :status :params :res[content-length] ":referrer" ":user-agent"');

// log all requests to access.log
app.use(morgan('info', {
  stream: reqLog.stream,
}));

// 导入路由
const userRouter = require('./routes/user');
const projectRouter = require('./routes/project');
const jserrorRouter = require('./routes/jserror');
const analytics = require('./routes/analytics');
const uploadRouter = require('./routes/upload');
const verifyRouter = require('./routes/verify');

app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);
app.use('/api/jserror', jserrorRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/verify', verifyRouter);
app.use('/jsSDKAnalytics', analytics);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // add this line to include winston logging
  reqLog.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(config.port, () => {
  console.log('node start');
});
