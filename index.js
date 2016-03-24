const _ = require('lodash');
const bunyan = require('bunyan');
const sails_bunyan_log_mapping = {
  error: "error",
  warn: "warn",
  debug: "debug",
  info: "info",
  verbose: "debug",
  silly: "trace"
};
const log = bunyan.createLogger({
  name: "request"
});

module.exports = function (sails) {
  log.level(sails_bunyan_log_mapping[_.get(sails, 'config.log.level', 'silly')] || 'trace');

  return {
    routes: {
      after: {
        '*': function (req, res, next) {
          const headers = req.isSocket ? req.socket.handshake.headers : req.headers;
          log.info({
            method: req.method,
            hostip: headers['x-real-ip'] || _.get(req, 'socket.handshake.address', req.ip),
            path: req.url,
            user: headers['x-auth-userid'],
            status: res.statusCode
          }, 'request');
          return next();
        }
      }
    }
  };
};
