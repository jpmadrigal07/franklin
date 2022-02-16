const mongoose = require("mongoose");
const { Schema } = mongoose;

const reports = new Schema({
  type: String,
  startDate: Date,
  endDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("Reports", reports);
