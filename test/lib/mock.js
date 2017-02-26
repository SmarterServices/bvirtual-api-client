'use strict';
const nock = require('nock');

const correctTokenHeader = {
    reqheaders: {
      authorization: 'BASIC correctToken'
    }
  },
  wrongTokenHeader = {
    reqheaders: {
      authorization: 'BASIC wrongToken'
    }
  };

const mockRequests = function mock(url) {

  nock(url, correctTokenHeader)
    .get('/test')
    .reply(200, {working: true});

  nock(url, wrongTokenHeader)
    .get('/test')
    .reply(307, {working: false, message: 'Incorrect password !'});


};

module.exports = mockRequests;

