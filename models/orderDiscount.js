const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderDiscount = new Schema({
  jobOrderNumber: {
    type: mongoose.Schema.Types.String,
    ref: "Order",
  },
  discountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Discount",
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

module.exports = mongoose.model("OrderDiscount", orderDiscount);
