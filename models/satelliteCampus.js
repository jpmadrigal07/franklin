const mongoose = require('mongoose');
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const satelliteCampus = new Schema({
    campusName: {
        type: String,
        unique: true
    },
    mainCampusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"MainCampus"
    },
    schoolName: String,
    email: String,
    mobileNumber: String,
    currency: String,
    currencySymbol: String,
    city: String,
    state: String,
    address: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    deletedAt: Date
});

module.exports = mongoose.model('SatelliteCampus', satelliteCampus);