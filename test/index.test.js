/**
 * Created by robin on 23/03/16.
 */

const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const rewire = require('rewire');
const logging = rewire('../index');
const log = logging.__get__('log');

const res = {
    statusCode: 200
};

describe('Test logging', function () {

    before('get sails hook', function () {
        const sails = {
            config: {
                log: { }
            }
        };
        this.hook = logging(sails).routes.after['*'];
    });

    beforeEach('spy on the logger', function () {
        this.info = sinon.spy(log, 'info');
    });

    afterEach('reset the logger spy', function () {
        this.info.restore();
    });

    it('should log details for basic incoming requests', function () {
        const req = {
            method: 'GET',
            url: 'http://host.com/path',
            headers: {
                'x-real-ip': 'the real ip',
                'x-auth-userid': 'the user id'
            }
        };
        const next = sinon.spy();
        this.hook(req, res, next);
        expect(this.info).to.have.been.calledWith({
            method: req.method,
            hostip: req.headers['x-real-ip'],
            path: req.url,
            user: req.headers['x-auth-userid'],
            status: res.statusCode
        }, 'request');
        expect(next).to.have.been.called;
    });

    it('should log details for incoming websocket requests', function () {
        const req = {
            isSocket: true,
            method: 'GET',
            url: 'ws://host.com/path',
            socket: {
                handshake: {
                    headers: {
                        'x-real-ip': 'the real ip',
                        'x-auth-userid': 'the user id'
                    }
                }
            }
        };
        const next = sinon.spy();
        this.hook(req, res, next);
        expect(this.info).to.have.been.calledWith({
            method: req.method,
            hostip: req.socket.handshake.headers['x-real-ip'],
            path: req.url,
            user: req.socket.handshake.headers['x-auth-userid'],
            status: res.statusCode
        }, 'request');
        expect(next).to.have.been.called;
    });

});
