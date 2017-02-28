'use strict';
const nock = require('nock');
const testData = require('./../data/b-virtual-data.json');

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
    .get('/rest/test')
    .reply(200, {working: true});

  nock(url, wrongTokenHeader)
    .get('/rest/test')
    .reply(307, {working: false, message: 'Incorrect password !'});

  nock(url, correctTokenHeader)
    .post('/rest/scheduleAppointment', testData.scheduleAppointment.payload.valid)
    .reply(200, testData.scheduleAppointment.response.valid);

  nock(url, correctTokenHeader)
    .get('/rest/getAppointmentDetails/appointmentId/' + testData.getAppointmentDetails.payload.valid.appointmentId)
    .reply(200, testData.getAppointmentDetails.response.valid);

  nock(url, correctTokenHeader)
    .get('/rest/getAppointmentDetails/appointmentId/' + testData.getAppointmentDetails.payload.invalid.appointmentId)
    .reply(301, testData.getAppointmentDetails.response.error);

  nock(url, correctTokenHeader)
    .post('/rest/deleteAppointment', testData.deleteAppointment.payload.valid)
    .reply(200, testData.deleteAppointment.response.valid);

  nock(url, correctTokenHeader)
    .post('/rest/deleteAppointment', testData.deleteAppointment.payload.invalidAppointmentId)
    .reply(337, testData.deleteAppointment.response.invalidAppointmentId);


  nock(url, correctTokenHeader)
    .post('/rest/createExam', testData.createExam.payload.valid)
    .reply(200, testData.createExam.response.valid);


  nock(url, correctTokenHeader)
    .post('/rest/editExam', testData.createExam.payload.valid)
    .reply(200, testData.editExam.response.valid);


  nock(url, correctTokenHeader)
    .post('/rest/rescheduleAppointment', testData.rescheduleAppointment.payload.valid)
    .reply(200, testData.rescheduleAppointment.response.valid);


  nock(url, correctTokenHeader)
    .post('/rest/getExamCost', testData.getExamCost.payload.valid)
    .reply(200, testData.getExamCost.response.valid);

  nock(url, correctTokenHeader)
    .post('/rest/getAvailableSlots', testData.getExamCost.payload.valid)
    .reply(200, testData.getAvailableSlots.response.valid);

};

module.exports = mockRequests;

