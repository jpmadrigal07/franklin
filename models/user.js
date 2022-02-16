const mongoose = require('mongoose');
const { Schema } = mongoose;

const user = new Schema({
    username: String,
    password: String,
    userType: {
        type: String,
        enum: [
            'Admin',
            'Staff',
        ]
    },
    lastLoggedIn: Date,
    lastLoggedOut: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    deletedAt: Date
});

module.exports = mongoose.model('User', user);