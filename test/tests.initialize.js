const chai = require('chai');
const sinon = require('sinon');
const mockery = require('mockery');

process.env.NODE_ENV = 'test';
process.env.RETHINK_DB_NAME = 'test';
process.env.RETHINK_HOST = 'localhost';
process.env.RETHINK_PORT = '28015';
process.env.RETHINK_USER = 'admin';
process.env.RETHINK_PASS = '';

beforeEach(() => {
    global.expect = chai.expect;
    global.sinon = sinon;
    global.mockery = mockery;
    global.remote = {
        require: require
    };
});
