'use strict';
const joi = require('joi');
var joiSchema = {

  registerStudent: joi
    .object()
    .keys({
      loginID: joi
        .string()
        .email()
        .required(),
      firstName: joi
        .string()
        .required(),
      lastName: joi
        .string()
        .required(),
      phoneNo: joi
        .string(),
      password: joi
        .string()
        .required()
    }),
  checkTimeSlotAvailability: joi
    .object()
    .keys({
      courseCode: joi
        .string()
        .required(),
      examName: joi
        .string()
        .required(),
      startDateLong: joi
        .date()
        .timestamp()
        .required(),
      endDateLong: joi
        .date()
        .timestamp()
        .required()
    }),
  userExists: joi
    .object()
    .keys({
      userEmailID: joi
        .string()
        .email()
        .required()
    }),
  getAvailableSlots: joi
    .object()
    .keys({
      examName: joi
        .string()
        .required(),
      courseCode: joi
        .string()
        .required(),
      startDateLong: joi
        .date()
        .timestamp()
        .required(),
      endDateLong: joi
        .date()
        .timestamp()
        .required()
    }),
  getExamDetails: joi
    .object()
    .keys({
      name: joi
        .string()
        .required(),
      courseCode: joi
        .string()
        .required()
    }),
  getAvailableSlotsWithoutProctorCount: joi
    .object()
    .keys({
      courseCode: joi
        .string()
        .required(),
      examName: joi
        .string()
        .required(),
      startDateLong: joi
        .date()
        .timestamp()
        .required(),
      endDateLong: joi
        .date()
        .timestamp()
        .required()
    }),
  startExam: joi
    .object()
    .keys({
      appointmentID: joi
        .string()
        .required(),
      studentEmailID: joi
        .string()
        .email(),
      studentFirstName: joi
        .string(),
      studentLastName: joi
        .string(),
      examName: joi
        .string(),
      examCourseCode: joi
        .string(),
      additionalParameter: joi
        .string()
    }),
  onDemandStartExam: joi
    .object()
    .keys({
      studentEmailID: joi
        .string()
        .email()
        .required(),
      examName: joi
        .string()
        .required(),
      examCourseCode: joi
        .string()
        .required(),
      sessionID: joi
        .string()
        .required(),
      confirmationCode: joi
        .string(),
      voucherNumber: joi
        .string(),
      keyLockNumber: joi
        .string(),
      notes: joi
        .string()
    })

};


module.exports = joiSchema;

