'use strict';
let BVirtualClient = require('./index.js');
let client = new BVirtualClient({
  url: 'https://schedulerstaging.onlineproctornow.com',
  token: 'U21hcnRlclNlcnZpY2VzOjQyNjVhZTI2YzZlOWZlMjBkMmQ1YTFmYmU4NWU1ODQy'
});


let payload = {
  startDate: '1493769600000',
  endDate: '1494028800000',
  duration: 120,
  schedulingBuffer: 30,
  examName: 'Sample Exam',
  courseCode: 'sample'
};

client.getAvailableSlotMatrix(payload)
  .then(data=>{
    console.log(data);
  })
  .catch(error=>{
    console.error(error);
  });
