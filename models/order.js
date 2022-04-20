const mongoose = require("mongoose");
const { Schema } = mongoose;

const order = new Schema({
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
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
  },
  jobOrderNumber: String,
  weight: Number,
  amountDue: Number,
  plasticBag: Number,
  orderReceived: {
    type: Date,
    default: Date.now,
  },
  washCompleted: Date,
  dryCompleted: Date,
  foldCompleted: Date,
  payment: Date,
  release: Date,
  paidStatus: String,
  orderStatus: String,
  claimStatus: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("Order", order);
