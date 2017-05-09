"use strict";

// node modules
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
        let date = moment(slot[0].localStart);
        return date.format('YYYY-MM-DD');
      }
    }
  }

  /**
   * Add 'localStart' field in each schedule
   * @param {Array<Array<Object>>} schedulesOfDays - Array of schedule list
   * @param {Number} tzOffset - Time zone offset in hour
   * @returns {Array<Array<Object>>} Updated array of schedule list
   */
  static addLocalTime(schedulesOfDays, tzOffset) {
    for(let scheduleList of schedulesOfDays) {
      for(let schedule of scheduleList) {
        let localTime = moment(schedule.startDate);
        // add time zone offset
        localTime.add(tzOffset, 'hour');
        // set localStart with updated time
        schedule.localStart = localTime.toISOString();
      }
    }
    
    return schedulesOfDays;
  }

  /**
   * Categorize schedules by 'localStart' value
   * @param {Array<Array<Object>>} schedulesOfDays - Array of schedule list
   * @returns {Array<Array<Object>>} - Updated array of schedule list with
   */
  static categorizeWithLocalTime(schedulesOfDays) {
    let updatedSchedulesOfDays = [];

    // create two extra day slot in the array
    // as after categorizing by local time
    // schedules may move to nex/previous day
    for (let i = 0; i < schedulesOfDays.length + 2; i++) {
      updatedSchedulesOfDays.push([]);
    }

    for (let i = 0; i < schedulesOfDays.length; i++) {
      var scheduleList = schedulesOfDays[i];
      for (let j = 0; j < scheduleList.length; j++) {
        var schedule = scheduleList[j];
        let startDay = moment(schedule.startDate).dayOfYear();
        let localDay = moment(schedule.localStart).dayOfYear();

        if(localDay < startDay) {
          // this schedule should be one day before from its current day
          // because of local time zone
          updatedSchedulesOfDays[i].push(schedule);
        } else if(localDay > startDay) {
          // this schedule should be one day after from its current day
          // because of local time zone
          updatedSchedulesOfDays[i+2].push(schedule);
        } else {
          // this schedule should be on same day as its current day
          updatedSchedulesOfDays[i+1].push(schedule);
        }
      }
    }
    
    if(updatedSchedulesOfDays[0].length === 0) {
      // remove first item from the array if it does not contain any
      // schedule after categorizing
      updatedSchedulesOfDays.shift();
    }

    if(updatedSchedulesOfDays[updatedSchedulesOfDays.length - 1].length === 0) {
      // remove last item from the array if it does not contain any
      // schedule after categorizing
      updatedSchedulesOfDays.pop();
    }
    
    return updatedSchedulesOfDays;
  }
}

module.exports = MatrixFormatter;