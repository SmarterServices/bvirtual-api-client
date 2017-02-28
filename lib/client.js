'use strict';
const requestPromise = require('request-promise');
const joi = require('joi');
const joiSchema = require('./../payload-schema/joi-validation');
const get = require('lodash.get');


/**
 * check if the type of key and given type is same or not
 * @param value - Value to check the type of
 * @param {String} type - Expected type of the key
 * @returns {boolean} - true if same
 */
const isTypeOf = function (value, type) {
  return typeof value === type;
};

class Client {
  /**
   * Create a client for B Virtual
   * @param {Object} config
   * @param {String} config.url - URL to the API
   * @param {String} config.token - API token used for basicAuth
   */
  constructor(config) {
    this.url = config.url + '/rest';
    this.token = config.token;
  }

  /**
   * Send a request using provided config
   * @param {Object} requestConfig - Configuration for request
   */
  request(requestConfig) {
    requestConfig.headers = {
      Authorization: `BASIC ${this.token}`
    };

    return requestPromise(requestConfig);
  }

  /**
   * Post data to endpoint
   * @param {String} endpointName - Name of the endpoint
   * @param {Object} payload - Payload data
   * @return {Promise}
   */
  postData(endpointName, payload) {
    let _this = this;

    return new Promise(function post(resolve, reject) {
      joi.validate(payload, joiSchema[endpointName], function onJoiValidate(err) {
        if (err) {
          return reject(get(err, 'details[0].message'));
        }

        let options = {
          method: 'POST',
          uri: `${_this.url}/${endpointName}`,
          body: payload,
          json: true,
          resolveWithFullResponse: false
        };

        _this
          .request(options)
          .then(resolve)
          .catch(reject);
      });
    });

  }

  testRequest() {
    let requestConfig = {
      uri: `${this.url}/test`,
      json: true
    };

    return this.request(requestConfig)
  }

  /**
   * Registers new student. Accepts required student details and stores it in the database
   * @param {{loginID:string, firstName:string, lastName:string,password:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  registerStudent(payload) {
    return this.postData('registerStudent',payload);
  }

  /**
   * Schedules an appointment for a student
   * @param {Object} payload - Payload to send with request
   * @return {Promise}
   */
  scheduleAppointment(payload) {
    return this.postData('scheduleAppointment', payload);
  }

  /**
   * Get appointment details for appointmentId
   * @param {Object} appointmentId - Payload to send with request
   * @return {Promise}
   */
  getAppointmentDetails(appointmentId) {
    let _this = this;

    return new Promise(function schedule(resolve, reject) {
      if (!appointmentId) {
        return reject('AppointmentId is required');
      }

      let options = {
        method: 'GET',
        uri: `${_this.url}/getAppointmentDetails/appointmentId/${appointmentId}`,
        json: true,
        resolveWithFullResponse: false
      };

      _this
        .request(options)
        .then(resolve)
        .catch(reject);

    });
  }

  /**
   * Deletes an appointment for a student
   * @param {String} studentEmailID - EmailId of student
   * @param {Object} appointmentID - Payload to send with request
   * @return {Promise}
   */
  deleteAppointment(studentEmailID, appointmentID) {
    return this.postData('deleteAppointment', {studentEmailID, appointmentID});
  }


  /**
   * Creates an exam with provided payload
   * @param {Object} payload - Payload to send with request
   * @return {Promise}
   */
  createExam(payload) {
    return this.postData('createExam', payload);
  }


  /**
   * Edits an exam with provided payload
   * @param {Object} payload - Payload to send with request
   * @return {Promise}
   */
  editExam(payload) {
    return this.postData('editExam', payload);
  }

  /**
   * reschedules an appointment for a appointmentId
   * @param {Object} payload - Payload to send with request
   * @return {Promise}
   */
  rescheduleAppointment(payload) {
    return this.postData('rescheduleAppointment', payload);
  }


  /**
   * reschedules an appointment for a appointmentId
   * @param {Object} payload - Payload to send with request
   * @return {Promise}
   */
  getExamCost(payload) {
    return this.postData('getExamCost', payload);
  }



  /**
   * Checks if a time slot is available for scheduling an appointment
   * @param {{courseCode:string, examName:string, startDateLong:string,endDateLong:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  checkTimeSlotAvailability(payload) {
    return this.postData('checkTimeSlotAvailability',payload);
  }

  /**
   * Checks if user exists in the system
   * @param {{userEmailID:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  userExists(payload) {
    return this.postData('userExists',payload);
  }

  /**
   * Returns a list of all Proctors for an institute
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  getAllProctorsForInstitute() {
    let _this = this;
    return new Promise(function (resolve, reject) {

      let options = {
        method: 'GET',
        uri: `${_this.url}/getAllProctorsForInstitute`,
        json: true,
        resolveWithFullResponse: false

      };

      _this.request(options)
        .then(resolve)
        .catch(reject);

    });
  }

  /**
   * Gets all available time slots and number of proctor for each available time slot
   * @param {{courseCode:string, examName:string, startDateLong:string,endDateLong:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  getAvailableSlots(payload) {
    return this.postData('getAvailableSlots',payload);
  }

  /**
   * Gets exam details
   * @param {{courseCode:string, examName:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  getExamDetails(payload) {
    return this.postData('getExamDetails',payload);
  }

  /**
   * Gets all available time slots for each available time slot without the number of proctors for each slot
   * @param {{courseCode:string, examName:string, startDateLong:string,endDateLong:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  getAvailableSlotsWithoutProctorCount(payload) {
    return this.postData('getAvailableSlotsWithoutProctorCount',payload);
  }

  /**
   * Start exam
   * @param {{appointmentID:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  startExam(payload) {
    return this.postData('startExam',payload);
  }

  /**
   * On Demand Start exam
   * @param {{studentEmailID:string, examName:string, examCourseCode:string,sessionID:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  onDemandStartExam(payload) {
    return this.postData('onDemandStartExam',payload);
  }
}

module.exports = Client;

