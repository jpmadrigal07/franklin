const mongoose = require("mongoose");
const { Schema } = mongoose;

const inventory = new Schema({
  orderItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "_id",
  },
  type: String,
  stockCode: String,
  name: String,
  unitCost: Number,
  stock: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("Inventory", inventory);
