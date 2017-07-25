'use strict';

let client = undefined;
const MatrixFormatter = require('./matrix-formatter');
const moment = require('moment');

const timeSlots = [
  {
    startTime: moment('2017-01-01T00:00:00.000Z').utc(),
    endTime: moment('2017-01-01T06:00:00.000Z').utc()
  },
  {
    startTime: moment('2017-01-01T06:00:00.000Z').utc(),
    endTime: moment('2017-01-01T12:00:00.000Z').utc()
  },
  {
    startTime: moment('2017-01-01T12:00:00.000Z').utc(),
    endTime: moment('2017-01-01T18:00:00.000Z').utc()
  },
  {
    startTime: moment('2017-01-01T18:00:00.000Z').utc(),
    endTime: moment('2017-01-01T23:59:59.000Z').utc()
  }
];
const minItemsRequiredPerSlot = 3;
const minRequiredDaysInMatrix = 3;
const maxSumOfItemsInSlot = 9;

/**
 * Get the suggested schedule matrix
 * @param {Array<Array<Array<{Object}>>>} schedulesOfDates -  The schedules of all dates in date range
 * @returns {Array<Array<Array<{Object}>>>} The schedule matrix
 */
function buildMatrix(schedulesOfDates) {
  let totalDays = schedulesOfDates.length;
  let startDay = 0;
  let lastDay = totalDays - 1;
  let dayBeforeLastDay = lastDay - 1;
  let middleDay = parseInt(dayBeforeLastDay / 2);
  let itemsTakenPerSlot = getEmptySlots(0);
  let matrix = [];
  let dayOptions = {};

  if (totalDays <= 3) {
    // as we have maximum three days to choose from
    // return all of them
    for(let schedules of schedulesOfDates) {
      takeDay(matrix, schedules, itemsTakenPerSlot);
    }
    return matrix;
  }

  // now take day1, dayN/2 & dayN-1
  // as they are defaults to be taken
  takeDefaultThreeDays(matrix,
    schedulesOfDates[startDay],
    schedulesOfDates[middleDay],
    schedulesOfDates[dayBeforeLastDay],
    itemsTakenPerSlot);

  if (satisfyMatrix(matrix, itemsTakenPerSlot)) {
    // the matrix is satisfied with the requirements
    return matrix;
  }


  dayOptions.startDay = startDay + 1;
  dayOptions.middleDay = middleDay;
  dayOptions.endDay = dayBeforeLastDay;

  takeDaysFromTwoHalves(schedulesOfDates, dayOptions, matrix, itemsTakenPerSlot);

  if(satisfyMatrix(matrix, itemsTakenPerSlot)) {
    return matrix;
  }

  // matrix is not yet satisfied by requirement
  // take the last day as last resort
  // matrix.push(schedulesOfDates[lastDay]);
  takeDay(matrix, schedulesOfDates[lastDay], itemsTakenPerSlot);

  return matrix;
}
/**
 * Get the exam schedule matrix for suggested time
 * @param {Object} payload - Payload for getting schedules
 * @param {String} payload.startDate - Time in milliseconds
 * @param {String} payload.endDate - Time in milliseconds
 * @param {Number} payload.duration - Exam duration in minutes
 * @param {Number} payload.schedulingBuffer - Time in minutes
 * @param {String} payload.examName - Name of the exam
 * @param {String} payload.courseCode - Code of the course
 * @param {Object} bVirtualClient - BVirtual client instance
 * @returns {Promise}
 * @resolves {Matrix} - A 3D array containing date & slot respective schedules
 * @rejects {Error}
 */
function getAvailableSlotMatrix(payload, bVirtualClient) {
  // save client instance for future use
  client = bVirtualClient;
  return getSchedulesPerDay(payload)
    .then(function (schedules) {
      let matrix = undefined;
      let unsatisfiedMatrix = [];
      // add 'localStart' filed with localTime AND
      // update schedule array according to 'locaStart' time
      let schedulesWithLocalTime = MatrixFormatter.categorizeWithLocalTime(schedules, payload.tzOffset);

      // split schedules into time slot for each day to create a matrix
      for(let scheduleList of schedulesWithLocalTime) {
        let schedulesInTimeSlot = structureSchedule(scheduleList);
        unsatisfiedMatrix.push(schedulesInTimeSlot);
      }
      // build the original matrix
      matrix = buildMatrix(unsatisfiedMatrix);

      return Promise.resolve(matrix);
    })
    .catch(err => {
      console.error(err);
    });
}
/**
 * Gets an empty slot array filled with items
 * @param {Any|'array'} fillWith - Fills the returned array with this
 * @returns {Array}
 */
function getEmptySlots(fillWith) {
  let slots = [];
  let totalSlots = timeSlots.length;

  for (let i = 0; i < totalSlots; ++i) {
    if (fillWith === 'array') {
      slots.push([]);
    } else {
      slots.push(fillWith);
    }
  }

  return slots;
}
/**
 * Get all the schedules of specific day
 * @param {Object} fromTime - Starting time of the day
 * @param {Object} toTime - End time of the day
 * @param {String} inclusion - Valid chars are '[,],(,)'
 * '[' means day start from 00:00:00
 * ']' means day ends on 23:59:59
 * @param {Object} data - Payload for getting schedules
 * @param {String} data.startDate - Time in milliseconds
 * @param {String} data.endDate - Time in milliseconds
 * @param {String} data.examName - Name of the exam
 * @param {String} data.courseCode - Code of the course
 * @returns {Promise}
 * @resolves {}
 * @rejects {Error}
 */
function getSchedulesOfDay(fromTime, toTime, inclusion, data) {
  let startDate = moment(fromTime);
  let endDate = moment(toTime);
  let examName = data.examName;
  let courseCode = data.courseCode;
  let payload = {examName, courseCode};

  if (inclusion.charAt(0) === '[') {
    // day starts at 00:00:00
    startDate.startOf('day');
  }

  if (inclusion.charAt(1) === ']') {
    // day ends at 23:59:59
    endDate.endOf('day');
  }

  payload.startDateLong = startDate.format('x');
  payload.endDateLong = endDate.format('x');

  return client
    .getAvailableSlots(payload)
    .then(function (data) {
      // if a day doesn't have any schedule it returns with null
      // if return empty array in that case
      let structuredSchedule = data.availableTimeSlotsListVo || [];
      return Promise.resolve(structuredSchedule);
    });
}
/**
 * Get available exam schedules for each day in the date range
 * @param {Object} data - Payload for getting schedules
 * @param {String} data.startDate - Time in milliseconds
 * @param {String} data.endDate - Time in milliseconds
 * @param {Number} data.duration - Exam duration in minutes
 * @param {Number} data.schedulingBuffer - Time in minutes
 * @param {String} data.examName - Name of the exam
 * @param {String} data.courseCode - Code of the course
 * @returns {Promise}
 * @resolves {Matrix} - A 3D array containing date & slot respective schedules
 */
function getSchedulesPerDay(data) {
  let startDate = moment(parseInt(data.startDate)).utc();
  let endDate = moment(parseInt(data.endDate)).utc();
  let totalExamDuration = data.duration + data.schedulingBuffer;
  // subtract exam duration and buffer from end date
  // so that exam does not gets timeout
  let adjustedEndDate = moment(endDate).subtract(totalExamDuration, 'minute');
  let totalDates = endDate.diff(startDate, 'd') + 1;
  let schedulePromises = [];

  for (let i = 1; i <= totalDates; ++i) {
    // let scheduleDate = moment(startDate);
    let schedulePromise;

    if(i === 1 && i === totalDates) {
      // get schedules for only one day
      schedulePromise = getSchedulesOfDay(startDate, adjustedEndDate, '()', data);
    }
    else if (i === 1) {
      // get schedules for first day from starting time till end of day
      schedulePromise = getSchedulesOfDay(startDate, startDate, '(]', data);
    } else if (i === totalDates) {
      // get schedules for last day from beginning of day till calculated time
      schedulePromise = getSchedulesOfDay(adjustedEndDate, adjustedEndDate, '[)', data);
    } else {
      // get schedules for full day
      schedulePromise = getSchedulesOfDay(startDate, startDate, '[]', data);
    }

    schedulePromises.push(schedulePromise);
    // increment day by 1
    startDate.add(1, 'day');
  }

  return Promise.all(schedulePromises);
}
/**
 * Returns the timeSlots index of a schedule that it fits
 * @param {Object} scheduleDate - Schedule start date/time
 * @returns {number}
 */
function getSlotNumber(scheduleDate) {
  for (let j = 0; j < timeSlots.length; j++) {
    let slot = timeSlots[j];

    // reset the slot date with respect to schedule date
    slot.startTime = normalizeYearMonthDay(slot.startTime, scheduleDate);
    slot.endTime = normalizeYearMonthDay(slot.endTime, scheduleDate);

    if (scheduleDate.isBetween(slot.startTime, slot.endTime, 'minute', '[]')) {
      // this schedule is under this slot
      return j;
    }
  }

  // no slot found for this schedule
  return -1;
}
/**
 * Reset a date object with another date object's day
 * @param {Object} originalTime - The date to be normalized
 * @param {Object} normalizeWith - The date that is used to normalize
 * @returns {number|Moment|*}
 */
function normalizeYearMonthDay(originalTime, normalizeWith) {
  return originalTime.dayOfYear(normalizeWith.dayOfYear());
}
/**
 * Check if matrix is complete as per requirement
 * @param {Array<Array<Array>>} matrix - Schedule matrix
 * @param {Array<Number>} itemsTakenPerSlot - The array contains the sum of each slot items
 * @returns {boolean} - True if matrix satisfies requirement
 */
function satisfyMatrix(matrix, itemsTakenPerSlot) {
  let totalSlots = timeSlots.length;

  if(matrix.length < minRequiredDaysInMatrix) {
    // matrix should have minimum 3 days
    return false;
  }

  for (let i = 0; i < totalSlots; ++i) {
    if (itemsTakenPerSlot[i] < maxSumOfItemsInSlot) {
      // this slot does not satisfy the matrix
      return false;
    }
  }

  return true;
}
/**
 * Structure schedule object into array according to time slots
 * @param {Array<Object>} dates - List of schedule objects of the day
 * @returns {Array<Array<Object>>} - 2D array of schedule objects
 */
function structureSchedule(dates) {
  let slots = getEmptySlots('array');

  dates = dates || [];

  // loop through all the schedule object
  // and categorize them into slots
  for (let i = 0; i < dates.length; i++) {
    let schedule = dates[i];
    let scheduleDate = moment(schedule.localStart).utc();
    let slotNumber = undefined;

    // categorize schedules into time slot according to local time
    slotNumber = getSlotNumber(scheduleDate);

    if (slotNumber === -1) {
      console.log('not found:', scheduleDate.format());
      continue;
    }

    // push the schedule object into appropriate time slot
    slots[slotNumber].push(schedule);
  }

  return slots;
}
/**
 * Adds schedules of the specific day into matrix
 * @param {Array<Array<Array<Object>>>} matrix - Schedule matrix
 * @param {Array<Array<Object>>} schedulesOfDay - Schedules of the day
 * @param {Array<Number>} itemTakenPerSlot - The array contains the sum of each slot items
 */
function takeDay(matrix, schedulesOfDay, itemTakenPerSlot) {
  let dateShouldBeTaken = false;
  let schedulesInSlot = undefined;
  let schedulesTaken = [];

  for (let i = 0; i < itemTakenPerSlot.length; ++i) {
    // limit the number of schedules in this time slot
    schedulesInSlot = limitSchedulesInSlot(schedulesOfDay, i, itemTakenPerSlot);
    // save this slot into separate array
    schedulesTaken.push(schedulesInSlot);
    itemTakenPerSlot[i] += schedulesInSlot.length;
    if(schedulesInSlot.length > 0) {
      // this date has at least one slot with items
      // so take this date
      dateShouldBeTaken = true;
    }
  }

  if(dateShouldBeTaken) {
    // take this date
    matrix.push(schedulesTaken);
  }
}
/**
 * This function limits each slot to it minimum schedule number
 * The schedules are chosen randomly
 * @param {Array<Array<Object>>} schedulesOfDay - Schedules of the day
 * @param {Number} slotNumber - Number of current slot
 * @param {Array<Number>} itemTakenPerSlot - The array contains the sum of each slot items
 * @returns {Array<Object>} - Minimum number of schedules for this time slot
 */
function limitSchedulesInSlot(schedulesOfDay, slotNumber, itemTakenPerSlot) {
  let randomScheduleIndex = undefined;
  let randomSchedule = undefined;
  let limitedSchedules = [];
  let scheduleTaken = 0;
  let schedules = schedulesOfDay[slotNumber];
  let itemsRemainInThisSlot = maxSumOfItemsInSlot - itemTakenPerSlot[slotNumber];
  let itemsNeedInThisSlot = Math.min(minItemsRequiredPerSlot, itemsRemainInThisSlot);

  if(schedules.length <= itemsNeedInThisSlot) {
    return schedules;
  }

  while (scheduleTaken < itemsNeedInThisSlot) {
    // get a random number from 0 to number of schedules
    randomScheduleIndex = Math.floor(Math.random() * schedules.length);
    // take that random schedule
    randomSchedule = schedules[randomScheduleIndex];
    // keep this random schedule into separate array
    limitedSchedules.push(randomSchedule);
    // remove chosen schedule from original array
    schedules.splice(randomScheduleIndex, 1);
    // update total schedule taken for this slot
    ++scheduleTaken;
  }

  return limitedSchedules;
}
/**
 * Add schedules from dates taken from two halves of the date range
 * @param {Array<Array<Array<{Object}>>>} schedulesOfDates -  The schedules of all dates in date range
 * @param {Object} dayOptions - Dates to partition the date range into two halves
 * @param {Number} dayOptions.startDay - Date range starts from
 * @param {Number} dayOptions.middleDay - Middle date of date range
 * @param {Number} dayOptions.endDay - End date of date range
 * @param {Array<Array<Array<{Object}>>>} matrix - The schedule matrix
 * @param {Array<Number>} itemsTakenPerSlot - The array contains the sum of each slot items
 * @returns {Array<Array<Array<{Object}>>>} matrix - The updated schedule matrix
 */
function takeDaysFromTwoHalves(schedulesOfDates, dayOptions, matrix, itemsTakenPerSlot) {
  let startDay = dayOptions.startDay;
  let middleDay = dayOptions.middleDay;
  let endDay = dayOptions.endDay;

  for (let i = startDay, j = middleDay + 1, flag = true; i < middleDay || j < endDay;) {
    let dayTaken;
    if (flag && i < middleDay) {
      // flag is true and date can be taken from first half
      dayTaken = schedulesOfDates[i];
      flag = false;
      ++i;
    } else if (!flag && j < endDay) {
      // flag is false and date can be taken from second half
      dayTaken = schedulesOfDates[j];
      flag = true;
      ++j;
    } else if (i < middleDay) {
      // second half is complete
      // take from first half
      dayTaken = schedulesOfDates[i];
      ++i;
    } else if (j < endDay) {
      // first half is complete
      // take from second half
      dayTaken = schedulesOfDates[j];
      ++j;
    } else {
      break;
    }

    // take this day and add into matrix
    takeDay(matrix, dayTaken, itemsTakenPerSlot);
    if (satisfyMatrix(matrix, itemsTakenPerSlot)) {
      // the matrix is satisfied
      // no need to take another day of schedules
      return matrix;
    }
  }
}
/**
 * Add three dates into schedule matrix
 * @param {Array<Array<Array<{Object}>>>} matrix - The schedule matrix
 * @param {Array<Array<Object>>} day1 - Schedules of day1
 * @param {Array<Array<Object>>} day2 - Schedules of day2
 * @param {Array<Array<Object>>} day3 - Schedules of day3
 * @param {Array<Number>} itemsTakenPerSlot - The array contains the sum of each slot items
 */
function takeDefaultThreeDays(matrix, day1, day2, day3, itemsTakenPerSlot) {
  takeDay(matrix, day1, itemsTakenPerSlot);
  takeDay(matrix, day2, itemsTakenPerSlot);
  takeDay(matrix, day3, itemsTakenPerSlot);
}

module.exports = getAvailableSlotMatrix;