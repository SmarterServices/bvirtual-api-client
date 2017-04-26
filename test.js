'use strict';
let BVirtualClient = require('./index.js');
let client = new BVirtualClient({url: 'https://schedulerstaging.onlineproctornow.com', token: 'U21hcnRlclNlcnZpY2VzOjQyNjVhZTI2YzZlOWZlMjBkMmQ1YTFmYmU4NWU1ODQy'});

var payload = {
    "startDateLong":"1493769600000",
    "examName":"Sample Exam",
    "endDateLong":"1493856000000",
    "courseCode":"sample"
  };

client
  .getAvailableSlots(payload)
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });
