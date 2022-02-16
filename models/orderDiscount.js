const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderDiscount = new Schema({
  jobOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jobOrder",
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
