'use strict';

const RequestPromise = require('request-promise');

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
    this.url = config.url;
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

    return RequestPromise(requestConfig);
  }

  testRequest() {
    let requestConfig = {
      uri: `${this.url}/test`,
      json: true
    };

    return this.request(requestConfig)
  }
}

module.exports = Client;

