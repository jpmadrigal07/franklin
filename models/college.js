const mongoose = require('mongoose');
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const college = new Schema({
    collegeName: {
        type: String,
        unique: true
    },
    collegeCode: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    deletedAt: Date
});

module.exports = mongoose.model('College', college);