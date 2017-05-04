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
  startDate: '1493769600000',
  endDate: '1494288000000',
  duration: 120,
  schedulingBuffer: 30,
  examName: 'Sample Exam',
  courseCode: 'sample'
};

client.getAvailableSlotMatrix(payload)
  .then(matrix=> {
    for (let date of matrix) {
      let tableRow = [];
      for (let slot of date) {
        tableRow.push(slot.length);
      }
      table.push(tableRow);
    }
    console.log(table.toString());
  })
  .catch(error=> {
    console.error(error);
  });
