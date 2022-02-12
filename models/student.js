const mongoose = require("mongoose");
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const student = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  lrn: {
    type: Number,
    unique: true,
  },
  campusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MainCampus",
    ref: "SatelliteCampus",
  },
  admitType: String,
  typeOfStudent: String,
  firstName: String,
  middleName: String,
  lastName: String,
  extensionName: String,
  mobileNumber: String,
  landlineNumber: String,
  dateOfBirth: Date,
  placeOfBirth: String,
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  citizenship: String,
  houseNumber: String,
  street: String,
  barangay: String,
  municipality: String,
  province: String,
  zipCode: String,
  civilStatus: {
    type: String,
    enum: ["Single", "Married", "Widowed"],
  },
  guardianName: String,
  guardianAddress: String,
  fathersName: String,
  mothersName: String,
  dswdHouseholdNumber: String,
  dswdHouseholdPerCapitaIncome: Number,
  guardianMobileNumber: String,
  guardianEmail: String,
  relationWithGuardian: String,
  intendedCourse: {
    firstChoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    secondChoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    thirdChoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  educationalAttainment: {
    elementary: {
      schoolName: String,
      schoolAddress: String,
      typeOfSchool: {
        type: String,
        enum: ["Private", "Public"],
      },
      yearGraduated: String,
    },
    highSchool: {
      schoolName: String,
      schoolAddress: String,
      typeOfSchool: {
        type: String,
        enum: ["Private", "Public"],
      },
      yearGraduated: String,
    },
    seniorHighSchool: {
      schoolName: String,
      schoolAddress: String,
      typeOfSchool: {
        type: String,
        enum: ["Private", "Public"],
      },
      yearGraduated: String,
    },
    college: {
      schoolName: String,
      schoolAddress: String,
      typeOfSchool: {
        type: String,
        enum: ["Private", "Public"],
      },
      yearGraduated: String,
    },
    graduate: {
      schoolName: String,
      schoolAddress: String,
      typeOfSchool: {
        type: String,
        enum: ["Private", "Public"],
      },
      yearGraduated: String,
    },
    als: {
      schoolName: String,
      schoolAddress: String,
      typeOfSchool: {
        type: String,
        enum: ["Private", "Public"],
      },
      yearGraduated: String,
    },
  },

  disability: {
    type: String,
    enum: [
      "None",
      "Communication Disablity",
      "Disability Due to Chronic Illness",
      "Learning Disability",
      "Neurological Disablity",
      "Orthopedic Disability",
      "Psychosocial Disablity",
      "Visual Disabilty",
    ],
  },
  isIndigenousPerson: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("Student", student);
