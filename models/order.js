const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobOrder = new Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  laundryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Laundry",
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  weight: Number,
  amountDue: Number,
  orderReceived: Date,
  washCompleted: Date,
  dryCompleted: Date,
  foldCompleted: Date,
  payment: Date,
  release: Date,
  orderStatus: String,
  orderStatus: String,
  claimStatus: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("JobOrder", jobOrder);
