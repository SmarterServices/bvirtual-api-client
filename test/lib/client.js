'use strict';
const expect = require('chai').expect;

const mockRequest = require('./mock');

const BVirtualClient = require('./../../index');

const correctToken = 'correctToken',
  wrongToken = 'wrongToken',
  url = 'http://localhost:5678';

//Create mock response for the requests
mockRequest(url);

describe('Testing B Virtual API client', function () {
  describe('Testing testRequest', function () {
    it('Should take correct token and resolve with working as true', function () {

      let client = new BVirtualClient({url, token: correctToken});

      return client
        .testRequest()
        .then(function (data) {
          return expect(data.working).to.be.equal(true);
        })
    });
  });

});
