const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderWash = new Schema({
  jobOrderNumber: {
    type: mongoose.Schema.Types.String,
    ref: "Order",
  },
  washId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wash",
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
