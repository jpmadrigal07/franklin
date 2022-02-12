const mongoose = require('mongoose');
const { Schema } = mongoose;

// CREATE DB SCHEMA OF USERDOCUMENTS
const userDocument = new Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document"
    },
    documentPath: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    deletedAt: Date
});

module.exports = mongoose.model('UserDocument', userDocument);
