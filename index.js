/**
 * Created by robin on 23/03/16.
 */

const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "request"});

module.exports = function (sails) {
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
