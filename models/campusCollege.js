const mongoose = require('mongoose');
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const campusCollege = new Schema({
    campusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MainCampus",
        ref: "SatelliteCampus"
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    deletedAt: Date
});

module.exports = mongoose.model('CampusCollege', campusCollege);