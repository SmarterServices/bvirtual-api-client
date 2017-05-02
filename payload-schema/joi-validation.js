'use strict';
const joi = require('joi');

const joiSchema = {
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

  scheduleAppointment: joi
    .object()
    .keys({
      studentEmailID: joi
        .string()
        .required(),
      courseCode: joi
        .string()
        .required(),
      examName: joi
        .string()
        .required(),
      startDateLong: joi
        .date()
        .required(),
      endDateLong: joi
        .date()
        .required(),
      confirmationCode: joi
        .string(),
      voucherNumber: joi
        .string(),
      sessionID: joi
        .string(),
      keyLockNumber: joi
        .string(),
      notes: joi
        .string(),
      timeZone: joi
        .string()
        .required()
    }),

  deleteAppointment: joi
    .object()
    .keys({
      studentEmailID: joi
        .string()
        .email()
        .required(),
      appointmentID: joi
        .number()
        .required()
    }),

  createExam: joi
    .object()
    .keys({
      examName: joi.string()
        .required(),
      courseCode: joi
        .number()
        .required(),
      type: joi
        .string()
        .required()
        .valid('paper', 'online'),
      numberOfPages: joi
        .number(),
      duration: joi
        .number(),
      costUSD: joi
        .number().required(),
      startDateLong: joi
        .string()
        .required(),
      endDateLong: joi
        .string()
        .required(),
      retakingLimit: joi
        .number(),
      numberOfStudents: joi
        .number()
        .required(),
      additionalDetailsForProctor: joi
        .string(),
      alternateExamURL: joi
        .string(),
      alternateExamProcess: joi
        .string(),
      examPassword: joi
        .string(),
      professorName: joi
        .string()
        .required(),
      professorPhone: joi
        .string()
        .required(),
      professorEmail: joi
        .string()
        .email()
        .required(),
      enableEmailNotifications: joi
        .string(),
      notes: joi
        .string()
        .valid('yes', 'no')
        .required(),
      openTextBook: joi
        .string()
        .valid('yes', 'no')
        .required(),
      calculator: joi
        .string()
        .required(),
      formulaSheets: joi
        .string()
        .valid('yes', 'no')
        .required(),
      dictionary: joi
        .string()
        .valid('yes', 'no')
        .required(),
      websites: joi
        .string()
        .valid('yes', 'no')
        .required(),
      blankPaper: joi
        .string()
        .valid('yes', 'no')
        .required(),
      bioBreak: joi
        .string()
        .valid('yes', 'no')
        .required(),
      additionalInfo: joi
        .string(),
      proctorList: joi
        .array(),
      externalExamID: joi
        .string()

    }),


  editExam: joi
    .object()
    .keys({
      examId: joi
        .number()
        .required(),
      examName: joi.string()
        .required(),
      courseCode: joi
        .number()
        .required(),
      type: joi
        .string()
        .required()
        .valid('paper', 'online'),
      numberOfPages: joi
        .number(),
      duration: joi
        .number(),
      costUSD: joi
        .number().required(),
      startDateLong: joi
        .string()
        .required(),
      endDateLong: joi
        .string()
        .required(),
      retakingLimit: joi
        .number(),
      numberOfStudents: joi
        .number()
        .required(),
      additionalDetailsForProctor: joi
        .string(),
      alternateExamURL: joi
        .string(),
      alternateExamProcess: joi
        .string(),
      examPassword: joi
        .string(),
      professorName: joi
        .string()
        .required(),
      professorPhone: joi
        .string()
        .required(),
      professorEmail: joi
        .string()
        .email()
        .required(),
      enableEmailNotifications: joi
        .string(),
      notes: joi
        .string()
        .valid('yes', 'no')
        .required(),
      openTextBook: joi
        .string()
        .valid('yes', 'no')
        .required(),
      calculator: joi
        .string()
        .required(),
      formulaSheets: joi
        .string()
        .valid('yes', 'no')
        .required(),
      dictionary: joi
        .string()
        .valid('yes', 'no')
        .required(),
      websites: joi
        .string()
        .valid('yes', 'no')
        .required(),
      blankPaper: joi
        .string()
        .valid('yes', 'no')
        .required(),
      bioBreak: joi
        .string()
        .valid('yes', 'no')
        .required(),
      additionalInfo: joi
        .string(),
      proctorList: joi
        .array(),
      externalExamID: joi
        .string()

    }),

  rescheduleAppointment: joi
    .object()
    .keys({
      appointmentID: joi
        .number()
        .required(),
      studentEmailID: joi
        .string()
        .email()
        .required(),
      startDateLong: joi
        .date()
        .required(),
      endDateLong: joi
        .date()
        .required()
    }),

  getExamCost: joi
    .object()
    .keys({
      courseCode: joi
        .string()
        .required(),
      examName: joi
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
    }),
  getAvailableSlotMatrix: joi
    .object()
    .keys({
      examName: joi
        .string()
        .required(),
      courseCode: joi
        .string()
        .required(),
      startDate: joi
        .date()
        .timestamp()
        .required(),
      endDate: joi
        .date()
        .timestamp()
        .required(),
      duration: joi
        .number()
        .integer()
        .min(0)
        .options({convert: false})
        .required(),
      schedulingBuffer: joi
        .number()
        .integer()
        .min(0)
        .options({convert: false})
        .required()
    })

};


module.exports = joiSchema;

