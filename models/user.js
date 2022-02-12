const mongoose = require('mongoose');
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const user = new Schema({
    email: String,
    password: String,
    userType: {
        type: String,
        enum:[
            'Admin',
            'Student',
            'Teacher',
            'Accounting Officer',
            'Dean',
            'Registrar',
            'Guidance',
            'Clinic',
            'OSA',
            'Staff',
            'Director',
            'Associate Dean',
            'Chairperson',
            'Unit Officer',
            'Vice President',
            'Campus Director',
            'President',
            'Registrar Staff',
            'Human Resource Staff',
            'Human Resource Officer',
            'Dean Staff',
            'Accounting Staff',
            'Cashier Officer',
            'Cashier Staff',
            'Supply Officer',
            'Supply Staff'
        ]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt: Date,
    deletedAt: Date
});

module.exports = mongoose.model('User', user);