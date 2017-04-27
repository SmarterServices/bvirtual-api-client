'use strict';
let BVirtualClient = require('./index.js');
let client = new BVirtualClient({url: 'https://schedulerstaging.onlineproctornow.com', token: 'U21hcnRlclNlcnZpY2VzOjQyNjVhZTI2YzZlOWZlMjBkMmQ1YTFmYmU4NWU1ODQy'});
let moment = require('moment');


let payload = {
  startDate: '1493769600000',
  endDate: '1494028800000',
  duration: 120,
  schedulingBuffer: 30,
  examName: 'Sample Exam',
  courseCode: 'sample'
};

getAvailableSlotMatrix(payload);

function getAvailableSlotMatrix(data) {
  let startDate = moment(parseInt(data.startDate));
  let endDate = moment(parseInt(data.endDate));
  let totalDuration = data.duration + data.schedulingBuffer;
  let adjustedEndDate = moment(endDate).subtract(totalDuration, 'minute');
  let beforeEndDate = adjustedEndDate.subtract('1', 'day');
  // the following two variables are used to iterate through date range
  let dateFrom = startDate.dayOfYear();
  let dateTo = beforeEndDate.dayOfYear();

  for(let i = dateFrom; i <= dateTo; ++i) {
    let tempDate = moment(startDate);
    let payload = {
      "startDateLong": tempDate.format('x'),
      "endDateLong": startDate.endOf('day').format('x'),
      "examName": data.examName,
      "courseCode": data.courseCode
    };

    if(i > dateFrom) {
      payload.startDateLong = tempDate.startOf('day').format('x');
    }

    startDate.add(1, 'day');


    // console.log(startDate.add(j, 'day').format(), startDate.add(j+1, 'day').format());

    client
      .getAvailableSlots(payload)
      .then(data=>{
        let structuredSchedule = structureSchedule(data.availableTimeSlotsListVo);
        console.log(structuredSchedule);
      })
      .catch(err=>console.error(err));
  }
}


function buildMatrix(scheduleData) {
  let days = Object.keys(scheduleData);

  if(days.length <= 3 ) {
    return scheduleData;
  } else {
  // todo algo goes here
}
}

function structureSchedule(dates) {
  let data = {};
  
  dates = dates || [];

  for (let i = 0; i < dates.length; i++) {
    let schedule = dates[i];
    let scheduleDate = moment(schedule.startDate);
    let scheduleDay = scheduleDate.dayOfYear();
    let slotNumber = undefined;

    data[scheduleDay] = data[scheduleDay] || {};
    data[scheduleDay].slots = data[scheduleDay].slots || [];

    slotNumber = getSlotNumber(scheduleDate);

    if(slotNumber === -1) {
      console.log('not found:', scheduleDate.format());
      continue;
    }

    data[scheduleDay].slots[slotNumber] = data[scheduleDay].slots[slotNumber] || [];
    data[scheduleDay].slots[slotNumber].push(schedule);
  }

  return data;
}

function getSlotNumber(scheduleDate) {
  let timeSlots = [
    {
      startTime: moment().hour(0).minute(0).second(0),
      endTime: moment().hour(6).minute(0).second(0)
    },
    {
      startTime: moment().hour(6).minute(0).second(0),
      endTime: moment().hour(12).minute(0).second(0)
    },
    {
      startTime: moment().hour(12).minute(0).second(0),
      endTime: moment().hour(18).minute(0).second(0)
    },
    {
      startTime: moment().hour(18).minute(0).second(1),
      endTime: moment().hour(23).minute(59).second(59)
    }
  ];

  for (let j = 0; j < timeSlots.length; j++) {
    let slot = timeSlots[j];

    slot.startTime = normalizeYearMonthDay(slot.startTime, scheduleDate);
    slot.endTime = normalizeYearMonthDay(slot.endTime, scheduleDate);


    // console.log(j, slot.startTime.format(), scheduleDate.format(), slot.endTime.format());
    if(scheduleDate.isBetween(slot.startTime, slot.endTime, 'minute', '[]')) {
      // console.log(j, slot.startTime.format(), scheduleDate.format(), slot.endTime.format(), '----');
      return j;
    }
  }

  return -1;
}

function normalizeYearMonthDay(originalTime, normalizeWith) {
  return originalTime.dayOfYear(normalizeWith.dayOfYear());
}

class DayIterator {
  constructor(startDate, endDate, buffer) {
    this.buffer = parseInt(buffer) || 0;
    this.endDate = moment(parseInt(endDate)).subtract(this.buffer, 'minute');
    this.startDate = moment(parseInt(startDate));
    this.lastDate = moment(endDate);
    this.firstDayTaken = false;

    endDate.subtract(1, 'day');
  }



  get nextDay() {
    let day = {
      start: moment(this.startDate),
      end: moment(this.startDate).hour(23).minute(59).second(59).millisecond(999),
      isLastDay: false
    };

    if(this.startDate.dayOfYear() >= this.lastDate.dayOfYear()) {
      day.isLastDay = true;
      day.start = moment(this.lastDate).hour(0).minute(0).second(0).millisecond(0);
      day.end = this.lastDate;
      return day;
    }

    // increment start date
    this.startDate.add(1, 'day');
    if(!this.firstDayTaken) {
      this.firstDayTaken = true;
    } else {
      day.start.hour(0).minute(0).second(0).millisecond(0);
    }

    return day;
  }
}
