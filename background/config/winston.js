const appRoot = require('app-root-path');
const winston = require('winston');
const moment = require('moment');

// define the custom settings for each transport (file, console)
const options = {
  accessFile: {
    level: 'info',
    filename: `${appRoot}/logs/access.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    prettyPrint: true,
    json: false,
    colorize: true,
    timestamp() {
      return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    },
  },
  errorFile: {
    level: 'error',
    filename: `${appRoot}/logs/debug.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
};

const format = winston.format.combine(
  // winston.format.colorize({all: true}),
  winston.format.timestamp(),
  winston.format.printf((info) => {
    const message = info.message || '';
    return `${info.timestamp} ${message}`;
  }),
);

const transportConsole = new winston.transports.Console(options.console);
const accessTransportFile = new winston.transports.File(options.accessFile);
const errorTransportFile = new winston.transports.File(options.errorFile);

// default container输出日志到标准输出及debug.log文件中
winston.loggers.add('default', {
  format,
  transports: [transportConsole, errorTransportFile],
});

// request container输出日志到到标准输出、access.log文件中
winston.loggers.add('request', {
  format,
  transports: [transportConsole, accessTransportFile],
});

// instantiate a new Winston Logger with the settings defined above
const reqLog = winston.loggers.get('request');

const defaultLog = winston.loggers.get('default');

// create a stream object with a 'write' function that will be used by `morgan`. This stream is based on node.js stream https://nodejs.org/api/stream.html
reqLog.stream = {
  write: (message) => {
    reqLog.info(message);
  },
};

exports.reqLog = reqLog;
exports.log = defaultLog;
