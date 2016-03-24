const bunyan = require('bunyan');
const sails_bunyan_log_mapping = {
  error: "error",
  warn: "warn",
  debug: "debug",
  info: "info",
  verbose: "debug",
  silly: "trace",
};

module.exports = function (sails) {
  const log = bunyan.createLogger({
    name: "request",
    level: sails_bunyan_log_mapping[sails.config.log.level] || 'trace'
  });

  return {
    routes: {
      after: {
        '*': function (req, res, next) {
          const headers = req.isSocket ? req.socket.handshake.headers : req.headers;
          log.info({
            method: req.method,
            hostip: headers['x-real-ip'] || req.ip || req.socket.handshake.address,
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
