const mongoose = require("mongoose");
const { Schema } = mongoose;

const wash = new Schema({
  type: String,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("Wash", wash);
