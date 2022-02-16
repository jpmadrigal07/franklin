const mongoose = require("mongoose");
const { Schema } = mongoose;

const folder = new Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  timeIn: Date,
  timeOut: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("Folder", folder);
