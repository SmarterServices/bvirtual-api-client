'use strict';

let BVirtualClient = require('./index.js');
let client = new BVirtualClient({
  url: 'https://schedulerstaging.onlineproctornow.com',
  token: 'U21hcnRlclNlcnZpY2VzOjQyNjVhZTI2YzZlOWZlMjBkMmQ1YTFmYmU4NWU1ODQy'
});
const CliTable = require('cli-table');

// create table to display time slots
let table = new CliTable({
  head: ['00 - 06', '06 - 12', '12 - 18', '18 - 00']
  , colWidths: [25, 25, 25, 25]
});

let payload = {
  "courseCode": "EXb33a65f3c2e34f0d98ad410944f3b8df",
  "examName": "Jason Sandbox - Final Exam",
  "duration": 90,
  "startDate": "1496116800000",
  "endDate": "1496894400000",
  "schedulingBuffer": 30,
  "tzOffset": -4
};
console.time('Total Time:');
client.getAvailableSlotMatrix(payload)
  .then(matrix=> {
    console.log(JSON.stringify(matrix, null, 2));
    for (let date in matrix) {
      let timeSlots = matrix[date];
      let tableRow = [];
      for (let slot in timeSlots) {
        tableRow.push(timeSlots[slot].length);
      }
      table.push(tableRow);
    }
    console.log(table.toString());
    console.timeEnd('Total Time:');
  })
  .catch(error=> {
    console.error(error);
  });
