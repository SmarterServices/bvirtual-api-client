"use strict";

const moment = require('moment');

class MatrixFormatter {
  constructor(matrix) {
    this.formattedMatrix = {};
    this.matrix = matrix;
  }

  /**
   * Format the matrix
   * @returns {Object} - Formatted matrix
   */
  format() {
    for (let timeSlotsOfDay of this.matrix) {
      let date = this.getDate(timeSlotsOfDay);
      this.formattedMatrix[date] = this.formatTimeSlot(timeSlotsOfDay);
    }

    return this.formattedMatrix;
  }

  /**
   * Converts time slot array into an object with time range as key
   * @param {<Array<Array<Object>>>} timeSlotsOfDay - An array of time slots
   * @returns {{}}
   */
  formatTimeSlot(timeSlotsOfDay) {
    let slotsMap = ['00-06','06-12', '12-18', '18-00'];
    let formattedTimeSlots = {};

    for(let i = 0; i < 4; ++i) {
      let slotName = slotsMap[i];
      formattedTimeSlots[ slotName ] = timeSlotsOfDay[i];
    }

    return formattedTimeSlots;
  }

  /**
   * Get date from an array of time slots containing schedules
   * in format 'YYYY-MM-DD'
   * @param {<Array<Array<Object>>>} timeSlots - An array of time slots
   * @returns {string} Date string
   */
  getDate(timeSlots) {
    for (let slot of timeSlots) {
      if(slot.length > 0) {
        let date = moment(slot[0].startDate);
        return date.format('YYYY-MM-DD');
      }
    }
  }
}

module.exports = MatrixFormatter;