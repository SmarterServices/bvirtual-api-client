'use strict';
const expect = require('chai').expect;

const mockRequest = require('./mock');
const BVirtualClient = require('./../../index');
const testData = require('./../data/b-virtual-data.json');

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


  describe('Testing scheduleAppointment method', function () {

    it('Should take valid payload data and return 200 response code', function (done){
      let client = new BVirtualClient({url, token: correctToken});

      client
        .scheduleAppointment(testData.scheduleAppointment.payload.valid)
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          expect(response)
            .to
            .contain
            .all
            .keys(Object.keys(testData.scheduleAppointment.response.valid));
          done();
        })
        .catch(done);

    });

    it('Should throw error if any required properties are not provided', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .scheduleAppointment(testData.scheduleAppointment.payload.requiredNotProvided)
        .catch(function (ex) {
          return expect(ex).to.equal('"studentEmailID" is required');
        })

    });
  });


  describe('Testing getAppointmentDetails method', function () {

    it('Should take valid appointmentId and return 200 response code', function (done){
      let client = new BVirtualClient({url, token: correctToken});

      client
        .getAppointmentDetails(testData.getAppointmentDetails.payload.valid.appointmentId)
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          expect(response)
            .to
            .contain
            .all
            .keys(Object.keys(testData.getAppointmentDetails.response.valid));
          done();
        })
        .catch(done);

    });

    it('Should reject the promise if any appointmentId is not provided', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .getAppointmentDetails(null)
        .catch(function (ex) {
          return expect(ex).to.equal('AppointmentId is required');
        })

    });

    it('Should reject promise with 301 status code for invalid appointmentId', function (){
      let client = new BVirtualClient({url, token: correctToken});

       return client
        .getAppointmentDetails(testData.getAppointmentDetails.payload.invalid.appointmentId)
        .catch(function (error) {
          return expect(error.statusCode).to.equal(301);
        })

    });
  });

  describe('Testing deleteAppointment endpoint', function () {
    it('Should take valid studentEmailID, appointmentId and return 200 status code', function (done){
      let client = new BVirtualClient({url, token: correctToken});
      let payload = testData.deleteAppointment.payload.valid;

      client
        .deleteAppointment(payload.studentEmailID, payload.appointmentID)
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          done();
        })
        .catch(done);
    });

    it('Should not take invalid studentEmailID reject the promise', function (){
      let client = new BVirtualClient({url, token: correctToken});
      let payload = testData.deleteAppointment.payload.invalid;

      return client
        .deleteAppointment(payload.studentEmailID, payload.appointmentID)
        .catch(function (error) {
          return expect(error).to.equal('"studentEmailID" must be a valid email');
        })
    });


    it('Should not take non-existing appointmentId and  reject with 337 status code', function (){
      let client = new BVirtualClient({url, token: correctToken});
      let payload = testData.deleteAppointment.payload.invalidAppointmentId;

      return client
        .deleteAppointment(payload.studentEmailID, payload.appointmentID)
        .catch(function (error) {
          return expect(error.statusCode).to.equal(337);
        })
    });

  });


  describe('Testing create exam endpoint', function () {
    it('Should take valid payload and create an exam with 200 response', function (done){
      let client = new BVirtualClient({url, token: correctToken});

      client
        .createExam(testData.createExam.payload.valid)
        .then(function (data) {
          expect(data.statusCode).to.equal(200);
          expect(data.isCreated).to.equal(true);
          done();
        })
        .catch(done)

    });


    it('Should reject if any required fields are missing ', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .createExam(testData.createExam.payload.missingName)
        .catch(error => expect(error).to.equal('"examName" is required'));

    });

  });


  describe('Testing edit exam endpoint', function () {
    it('Should take valid payload and edit an existing exam and resolve with 200 response code', function (done){
      let client = new BVirtualClient({url, token: correctToken});

      client
        .editExam(testData.editExam.payload.valid)
        .then(function (data) {
          expect(data.statusCode).to.equal(200);
          expect(data.isEdited).to.equal(true);
          done();
        })
        .catch(done)

    });


    it('Should reject if any required fields are missing ', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .editExam(testData.editExam.payload.missingId)
        .catch(error => expect(error).to.equal('"examId" is required'));

    });

  });


  describe('Testing rescheduleAppointment method', function () {

    it('Should take valid payload data and return 200 response code', function (done){
      let client = new BVirtualClient({url, token: correctToken});

      client
        .rescheduleAppointment(testData.rescheduleAppointment.payload.valid)
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          done();
        })
        .catch(done);

    });

    it('Should throw error if any required properties are not provided', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .rescheduleAppointment(testData.rescheduleAppointment.payload.requiredNotProvided)
        .catch(function (ex) {
          return expect(ex).to.equal('"appointmentID" is required');
        })

    });
  });


  describe('Testing getExamCost method', function () {

    it('Should take valid payload data and return 200 response code', function (done){
      let client = new BVirtualClient({url, token: correctToken});

      client
        .getExamCost(testData.getExamCost.payload.valid)
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          expect(response.cost).to.be.a('number');
          done();
        })
        .catch(done);

    });

    it('Should throw error if any required properties are not provided', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .getExamCost(testData.getExamCost.payload.missingCourseCode)
        .catch(function (ex) {
          return expect(ex).to.equal('"courseCode" is required');
        })

    });
  });

describe('Testing correct and wrong token', function correctAndWrongToken() {
    it('should work correctly because of correct token', function goodToken() {

      let client = new BVirtualClient({url, token: correctToken});

      return client
        .getAllProctorsForInstitute()
        .then(function (data) {
          return expect(data.statusCode).to.be.equal(200);
        })
        .catch(function (error) {
          return expect(error).to.equal(null);
        });
    });

    it('should fail because of wrong token', function badToken() {

      let client = new BVirtualClient({url, token: wrongToken});

      return client
        .getAllProctorsForInstitute()
        .then(function (data) {
          return expect(data).to.equal(null);

        })
        .catch(function (error) {

          return expect(error.statusCode).to.be.equal(307);
        });
    });
  });

  describe('Testing registerStudent method', function registerStudent() {
    it('Should work correctly', function correctRegisterStudent() {

      let client = new BVirtualClient({url, token: correctToken});

      return client
        .registerStudent(testData.registerStudent.payload.valid)
        .then(function (data) {
          return expect(data.isRegistered).to.equal(true);
        })
        .catch(function (error) {
          return expect(error).to.equal(null);
        });
    });

    it('Should fail because of missing required field (firstName)', function missingRequiredRegisterStudentField() {

      let client = new BVirtualClient({url, token: correctToken});

      return client
        .registerStudent(testData.registerStudent.payload.missingRequiredField)
        .then(function (data) {
          console.log(data);
          return expect(data).to.equal(null);
        })
        .catch(function (error) {
          return expect(error).to.equal('"firstName" is required');
        });
    });

    it('Should fail because of invalid emailID', function invalidMailIDRegisterStudent() {

      let client = new BVirtualClient({url, token: correctToken});

      return client
        .registerStudent(testData.registerStudent.payload.invalidMailID)
        .then(function (data) {
          console.log(data);
        })
        .catch(function (error) {
          return expect(error).to.equal('"loginID" must be a valid email');
        });
    });

  });

  describe('Testing checkTimeSlotAvailability method', function checkTimeSlotAvailability() {
    it('Should work correctly', function correctResponse() {

      let client = new BVirtualClient({url, token: correctToken});

      return client
        .checkTimeSlotAvailability(testData.checkTimeSlotAvailability.payload.valid)
        .then(function (data) {
          return expect(data.statusCode).to.equal(200);
        })
        .catch(function (error) {
          return expect(error).to.equal(null);
        });
    });
    it('Should fail because of unavailable time', function unavailableTime() {

      let client = new BVirtualClient({url, token: correctToken});

      return client
        .checkTimeSlotAvailability(testData.checkTimeSlotAvailability.payload.unavailableTimeSlot)
        .then(function (data) {
          return expect(data).to.equal(null);
        })
        .catch(function (error) {
          return expect(error.statusCode).to.equal(351);

        });
    });
    it('Should fail because of missing required field(examName)', function missingRequiredField() {

      let client = new BVirtualClient({url, token: correctToken});

      return client
        .checkTimeSlotAvailability(testData.checkTimeSlotAvailability.payload.missingRequiredField)
        .then(function (data) {
          console.log(data);
          return expect(data).to.equal(null);
        })
        .catch(function (error) {
          return expect(error).to.equal('"examName" is required');
        });
    });
    it('Should fail because of invalid date format', function invalidDateFormat() {

      let client = new BVirtualClient({url, token: correctToken});

      return client
        .checkTimeSlotAvailability(testData.checkTimeSlotAvailability.payload.invalidDateFormat)
        .then(function (data) {
          console.log(data);
        })
        .catch(function (error) {
          return expect(error).to.equal('"endDateLong" must be a valid timestamp or number of milliseconds');
        });
    });

  });

  describe('Testing userExists method', function userExists() {
    it('Should work correctly', function correctResponse() {

      let client = new BVirtualClient({url, token: correctToken});

      return client
        .userExists(testData.userExists.payload.valid)
        .then(function (data) {
          return expect(data.statusCode).to.equal(200);
        })
        .catch(function (error) {
          return expect(error).to.equal(null);
        });
    });
    it('Should fail because user does not exist', function userDoesNotExist() {

      let client = new BVirtualClient({url, token: correctToken});

       return client
        .userExists(testData.userExists.payload.invalidUser)
        .then(function (data) {
          console.log(data);
          return expect(data).to.equal(null);
        })
        .catch(function (error) {
          return expect(error.statusCode).to.equal(348);
        });
    });

  });


  describe('Testing getAllProctorsForInstitute method', function getAllProctorsForInstitute() {
    it('should work correctly', function correctGetAllProctorsForInstitute() {

      let client = new BVirtualClient({url, token: correctToken});

      return client
        .getAllProctorsForInstitute()
        .then(function (data) {
          return expect(data.statusCode).to.be.equal(200);
        })
        .catch(function (error) {
          return expect(error).to.equal(null);
        });
    });

  });

  describe('Testing getAvailableSlots method', function () {

    it('Should take valid payload data and return 200 response code', function (done){
      let client = new BVirtualClient({url, token: correctToken});

      client
        .getAvailableSlots(testData.getAvailableSlots.payload.valid)
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          expect(response.availableTimeSlotsListVo).to.be.an('array');
          done();
        })
        .catch(done);

    });

    it('Should throw error if any required properties are not provided', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .getAvailableSlots(testData.getAvailableSlots.payload.missingCourseCode)
        .catch(function (ex) {
          return expect(ex).to.equal('"courseCode" is required');
        })

    });


    it('Should reject the promise with 351 response code if time slot is not available', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .getAvailableSlots(testData.getAvailableSlots.payload.unavailableTimeSlot)
        .catch(function (error) {
          return expect(error.statusCode).to.equal(351);
        })

    });
  });

  describe('Testing getExamDetails method', function () {

    it('Should take valid payload data and return 200 response code', function (done){
      let client = new BVirtualClient({url, token: correctToken});

      client
        .getExamDetails(testData.getExamDetails.payload.valid)
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          done();
        })
        .catch(done);

    });

    it('Should throw error if any required properties are not provided', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .getExamDetails(testData.getExamDetails.payload.missingCourseCode)
        .catch(function (ex) {
          return expect(ex).to.equal('"courseCode" is required');
        })

    });


    it('Should reject the promise with 351 response code if exam is not available', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .getExamDetails(testData.getExamDetails.payload.examDoesNotExist)
        .catch(function (error) {
          return expect(error.statusCode).to.equal(351);
        })

    });
  });


  describe('Testing getAvailableSlotsWithoutProctorCount method', function () {

    it('Should take valid payload data and return 200 response code', function (done){
      let client = new BVirtualClient({url, token: correctToken});

      client
        .getAvailableSlotsWithoutProctorCount(testData.getAvailableSlotsWithoutProctorCount.payload.valid)
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          expect(response.availableTimeSlotsListVo).to.be.an('array');
          done();
        })
        .catch(done);

    });

    it('Should throw error if any required properties are not provided', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .getAvailableSlotsWithoutProctorCount(testData.getAvailableSlotsWithoutProctorCount.payload.missingCourseCode)
        .catch(function (ex) {
          return expect(ex).to.equal('"courseCode" is required');
        })

    });


    it('Should reject the promise with 351 response code if time slot is not available', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .getAvailableSlotsWithoutProctorCount(testData.getAvailableSlotsWithoutProctorCount.payload.unavailableTimeSlot)
        .catch(function (error) {
          return expect(error.statusCode).to.equal(351);
        })

    });
  });


  describe('Testing startExam method', function () {
    it('Should take valid payload and create an exam with 200 response', function (done){
      let client = new BVirtualClient({url, token: correctToken});

      client
        .startExam(testData.startExam.payload.valid)
        .then(function (data) {
          expect(data.statusCode).to.equal(200);
          done();
        })
        .catch(done)

    });


    it('Should reject if any required fields are missing ', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .startExam(testData.startExam.payload.missingAppointID)
        .catch(error => expect(error).to.equal('"appointmentID" is required'));

    });

  });


  describe('Testing onDemandStartExam method', function () {
    it('Should take valid payload and create an exam with 200 response', function (done){
      let client = new BVirtualClient({url, token: correctToken});

      client
        .onDemandStartExam(testData.onDemandStartExam.payload.valid)
        .then(function (data) {
          expect(data.statusCode).to.equal(200);
          done();
        })
        .catch(done)

    });


    it('Should reject if any required fields are missing ', function (){
      let client = new BVirtualClient({url, token: correctToken});

      return client
        .onDemandStartExam(testData.onDemandStartExam.payload.missingStudentEmail)
        .catch(function(error){
          return expect(error).to.equal('"studentEmailID" is required')
        });

    });

  });

});
