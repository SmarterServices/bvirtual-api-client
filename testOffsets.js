var moment = require('moment');

var data = { "examName": "eCore - Production - Proctored Final MATH-1401-50G_Knofczynski",
  "courseCode": "EXd3b825a3d178448e8906724632789f13",
  "startDateLong": "1519880460000",
  "endDateLong": "1519948799998" }


console.log(parseInt(data.startDateLong));
console.log(parseInt(data.endDateLong));

_start = moment(parseInt(data.startDateLong));
_end = moment(parseInt(data.endDateLong));

console.log(_start.startOf('day'));
console.log(_end.endOf('day'));

console.log(_start.startOf('day').valueOf());
console.log(_dayEnd.add(1, 'ms').valueOf());
