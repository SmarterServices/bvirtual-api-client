'use strict';
let BVirtualClient = require('./index.js');
let client = new BVirtualClient({url: 'https://appt-onlineproctornow-com-fclj751c0rwy.runscope.net', token: ''});

var payload = {
"startDateLong": "1493766000000",
"examName": "Austin Peay State University - Test #3 (MC and Interpretation)",
"endDateLong": "1493788500000",
"courseCode": "227C1FC1-FC4F-419F-97A4-C3F41A75A8DF"
};

client
  .getAvailableSlots(payload)
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });
