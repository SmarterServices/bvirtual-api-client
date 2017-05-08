'use strict';

let BVirtualClient = require('./index.js');
let client = new BVirtualClient({
  url: 'https://schedulerstaging.onlineproctornow.com',
  token: 'U21hcnRlclNlcnZpY2VzOjQyNjVhZTI2YzZlOWZlMjBkMmQ1YTFmYmU4NWU1ODQy'
});
const CliTable = require('cli-table');
const MatrixFormatter = require('./lib/matrix-formatter');

// create table to display time slots
let table = new CliTable({
  head: ['00 - 06', '06 - 12', '12 - 18', '18 - 00']
  , colWidths: [25, 25, 25, 25]
});

let payload = {
  startDate: '1494115200000',
  endDate: '1494892800000',
  duration: 120,
  schedulingBuffer: 30,
  examName: 'Sample Exam',
  courseCode: 'sample'
};

client.getAvailableSlotMatrix(payload)
  .then(matrix=> {
    let matrixFormatter = new MatrixFormatter(matrix);
    let formattedMatrix = matrixFormatter.format();
    for (let date in formattedMatrix) {
      let timeSlots = formattedMatrix[date];
      let tableRow = [];
      for (let slot in timeSlots) {
        tableRow.push(timeSlots[slot].length);
      }
      table.push(tableRow);
    }
    console.log(table.toString());
  })
  .catch(error=> {
    console.error(error);
  });
