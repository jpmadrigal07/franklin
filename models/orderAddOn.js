const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderAddOn = new Schema({
  jobOrderNumber: {
    type: mongoose.Schema.Types.String,
    ref: "Order",
  },
  addOnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddOn",
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

module.exports = mongoose.model("OrderAddOn", orderAddOn);
