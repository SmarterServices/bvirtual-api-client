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
  startDate: '1494633600000',
  endDate: '1526169600000',
  duration: 120,
  schedulingBuffer: 30,
  examName: 'Sample Exam',
  courseCode: 'sample',
  tzOffset: 3.5
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
