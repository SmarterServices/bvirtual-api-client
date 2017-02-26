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
    return new Promise(function (resolve, reject) {

      joi.validate(payload, joiSchema.registerStudent, function (err, value) {
        if (err) {
          return reject(get(err, 'details[0].message'));
        }
      });

      var options = {
        method: 'POST',
        uri: `${this.url}/registerStudent`,
        body: payload,
        json: true,
        resolveWithFullResponse: false
      };
      requestPromise(options)
        .then(resolve)
        .catch(reject);

    });
  }

  /**
   * Checks if a time slot is available for scheduling an appointment
   * @param {{courseCode:string, examName:string, startDateLong:string,endDateLong:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  checkTimeSlotAvailability(payload) {
    return new Promise(function (resolve, reject) {

      joi.validate(payload, joiSchema.checkTimeSlotAvailability, function (err, value) {
        if (err) {
          return reject(get(err, 'details[0].message'));
        }
      });

      var options = {
        method: 'POST',
        uri: `${this.url}/checkTimeSlotAvailability`,
        body: payload,
        json: true,
        resolveWithFullResponse: false
      };

      requestPromise(options)
        .then(resolve)
        .catch(reject);

    });
  }

  /**
   * Checks if user exists in the system
   * @param {{userEmailID:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  userExists(payload) {
    return new Promise(function (resolve, reject) {

      joi.validate(payload, joiSchema.userExists, function (err, value) {
        if (err) {
          return reject(get(err, 'details[0].message'));
        }
      });

      var options = {
        method: 'POST',
        uri: `${this.url}/userExists`,
        body: payload,
        json: true,
        resolveWithFullResponse: false
      };

      requestPromise(options)
        .then(resolve)
        .catch(reject);

    });
  }

  /**
   * Returns a list of all Proctors for an institute
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  getAllProctorsForInstitute() {
    return new Promise(function (resolve, reject) {

      var options = {
        method: 'GET',
        uri: `${this.url}/getAllProctorsForInstitute`,
        json: true,
        resolveWithFullResponse: false

      };

      requestPromise(options)
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
    return new Promise(function (resolve, reject) {

      joi.validate(payload, joiSchema.getAvailableSlots, function (err, value) {
        if (err) {
          return reject(get(err, 'details[0].message'));
        }
      });

      var options = {
        method: 'POST',
        uri: `${this.url}/getAvailableSlots`,
        body: payload,
        json: true,
        resolveWithFullResponse: false
      };

      requestPromise(options)
        .then(resolve)
        .catch(reject);

    });
  }

  /**
   * Gets exam details
   * @param {{courseCode:string, examName:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  getExamDetails(payload) {
    return new Promise(function (resolve, reject) {

      joi.validate(payload, joiSchema.getExamDetails, function (err, value) {
        if (err) {
          return reject(get(err, 'details[0].message'));
        }
      });

      var options = {
        method: 'POST',
        uri: `${this.url}/getExamDetails`,
        body: payload,
        json: true,
        resolveWithFullResponse: false
      };

      requestPromise(options)
        .then(resolve)
        .catch(reject);

    });
  }

  /**
   * Gets all available time slots for each available time slot without the number of proctors for each slot
   * @param {{courseCode:string, examName:string, startDateLong:string,endDateLong:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  getAvailableSlotsWithoutProctorCount(payload) {
    return new Promise(function (resolve, reject) {

      joi.validate(payload, joiSchema.getAvailableSlotsWithoutProctorCount, function (err, value) {
        if (err) {
          return reject(get(err, 'details[0].message'));
        }
      });

      var options = {
        method: 'POST',
        uri: `${this.url}/getAvailableSlotsWithoutProctorCount `,
        body: payload,
        json: true,
        resolveWithFullResponse: false
      };

      requestPromise(options)
        .then(resolve)
        .catch(reject);

    });
  }
  /**
   * Start exam
   * @param {{appointmentID:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  startExam(payload) {
    return new Promise(function (resolve, reject) {

      joi.validate(payload, joiSchema.startExam, function (err, value) {
        if (err) {
          return reject(get(err, 'details[0].message'));
        }
      });

      var options = {
        method: 'POST',
        uri: `${this.url}/startExam `,
        body: payload,
        json: true,
        resolveWithFullResponse: false
      };

      requestPromise(options)
        .then(resolve)
        .catch(reject);

    });
  }

  /**
   * On Demand Start exam
   * @param {{studentEmailID:string, examName:string, examCourseCode:string,sessionID:string}} payload
   * @returns {Promise}
   * @resolves {}
   * @rejects {}
   */
  onDemandStartExam(payload) {
    return new Promise(function (resolve, reject) {

      joi.validate(payload, joiSchema.onDemandStartExam, function (err, value) {
        if (err) {
          return reject(get(err, 'details[0].message'));
        }
      });

      var options = {
        method: 'POST',
        uri: `${this.url}/onDemandStartExam `,
        body: payload,
        json: true,
        resolveWithFullResponse: false
      };

      requestPromise(options)
        .then(resolve)
        .catch(reject);

    });
  }

}

module.exports = Client;

