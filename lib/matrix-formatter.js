"use strict";

// node modules
const moment = require('moment');

class MatrixFormatter {
  constructor(matrix) {
    this.formattedMatrix = [];
    this.matrix = matrix;
  }

  /**
   * Format the matrix
   * @returns {Object} - Formatted matrix
   */
  format() {
    for (let timeSlotsOfDay of this.matrix) {
      let date = this.getDate(timeSlotsOfDay);
      let obj = {
        date: date,
        windows: this.formatTimeSlot(timeSlotsOfDay)
      };

      this.formattedMatrix.push(obj);
    }

    // sort dates
    this.sortDates();
    // sort time slot in each date
    this.sortSlots();

    return this.formattedMatrix;
  }

  /**
   * Sort matrix dates ascending order
   */
  sortDates() {
    this.formattedMatrix.sort(function (dateA, dateB) {
      return dateA.date.localeCompare(dateB.date);
    });
  }

  /**
   * Sort matrix slots ascending order
   */
  sortSlots() {
    for(let date in this.formattedMatrix) {
      let windows = this.formattedMatrix[date].windows;
      for(let slots in windows) {
        windows[slots].sort(function (slotA, slotB) {
          let dateA = moment(slotA.localStart).utc();
          let dateB = moment(slotB.localStart).utc();
          return dateA - dateB;
        });
      }
    }
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
        let date = moment(slot[0].localStart).utc();
        return date.format('YYYY-MM-DD');
      }
    }
  }

  /**
   * Categorize schedules by 'localStart' value
   * Which is calculated with 'tzOffset'
   * @param {Array<Array<Object>>} schedulesOfDays - Array of schedule list
   * @param {Number} tzOffset - Time zone offset in hour
   * @returns {Array<Array<Object>>} - Updated array of schedule list with
   */
  static categorizeWithLocalTime(schedulesOfDays, tzOffset) {
    let updatedSchedulesOfDays = [];
    let schedulesMap = {};
    let scheduleDates = [];

    for (let i = 0; i < schedulesOfDays.length; i++) {
      let scheduleList = schedulesOfDays[i];
      for (let j = 0; j < scheduleList.length; j++) {
        let date = undefined;
        let schedule = scheduleList[j];
        // let startDay = moment(schedule.startDate).utc();
        let localTime = moment(schedule.startDate).utc();
        // add time zone offset
        localTime.add(tzOffset, 'hour');
        // set localStart with updated time
        schedule.localStart = localTime.toISOString();
        // get the date of the schedule
        date = localTime.format('YYYY-MM-DD');
        // create an array with respect to the date
        schedulesMap[date] = schedulesMap[date] || [];
        // save the schedule with corresponding date
        schedulesMap[date].push(schedule);

      }
    }

    // sort the schedule dates
    scheduleDates = Object.keys(schedulesMap);
    scheduleDates.sort();

    // create an array of schedules
    // with sorted dates
    for(let date of scheduleDates) {
      updatedSchedulesOfDays.push(schedulesMap[date]);
    }

    return updatedSchedulesOfDays;
  }
}

module.exports = MatrixFormatter;