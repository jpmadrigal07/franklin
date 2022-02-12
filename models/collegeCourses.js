const mongoose = require('mongoose');
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const collegeCourses = new Schema({
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"College"
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    campusIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"MainCampus",
        ref:"SatteliteCampus",
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    deletedAt: Date
});

module.exports = mongoose.model('CollegeCourses', collegeCourses);