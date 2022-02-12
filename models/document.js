const mongoose = require('mongoose');
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERS
const document = new Schema({
    fileName: String,
    isApplyToAllCourse: Boolean,
    applyToCourses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    isApplyToAllAdmitType: Boolean,
    applyToAdmitTypes: { 
        type: String,
        enum: ["New Student", "Transferee", "Returnee", "Continuer", "Shifter"]
    },
    isEnrolleeRequiredToUpload: Boolean,
    isDocumentEnabled: Boolean,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    deletedAt: Date
});

module.exports = mongoose.model('Document', document);
