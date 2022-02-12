const mongoose = require('mongoose');
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const mainCampus = new Schema({
    campusName: {
        type: String,
        unique: true
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

module.exports = mongoose.model('MainCampus', mainCampus);