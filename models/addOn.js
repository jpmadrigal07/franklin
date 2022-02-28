const mongoose = require("mongoose");
const { Schema } = mongoose;

const addOn = new Schema({
  type: String,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("AddOn", addOn);
