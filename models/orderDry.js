const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderDry = new Schema({
  jobOrderNumber: {
    type: mongoose.Schema.Types.String,
    ref: "Order",
  },
  dryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dry",
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

module.exports = mongoose.model("OrderDry", orderDry);
