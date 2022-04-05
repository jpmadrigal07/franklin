const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderItem = new Schema({
  jobOrderNumber: {
    type: mongoose.Schema.Types.String,
    ref: "Order",
  },
  qty: Number,
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("OrderItem", orderItem);
