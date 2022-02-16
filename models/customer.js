const mongoose = require("mongoose");
const { Schema } = mongoose;

const customer = new Schema({
  firstName: String,
  lastName: String,
  street: String,
  barangayVillage: String,
  city: String,
  postalZipcode: String,
  birthday: String,
  contactNumber: String,
  landline: String,
  email: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  deletedAt: Date,
});

module.exports = mongoose.model("Customer", customer);
