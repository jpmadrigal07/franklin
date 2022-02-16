const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderWash = new Schema({
  jobOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jobOrder",
  },
  machineNumber: Number,
  qty: Number,
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("OrderWash", orderWash);
