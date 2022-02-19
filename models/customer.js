const mongoose = require("mongoose");
const { Schema } = mongoose;

const customer = new Schema({
  firstName: String,
  lastName: String,
  street: String,
  barangayVillage: String,
  cityProvince: String,
  postalZipcode: String,
  bdMonth: String,
  bdDay: String,
  bdYear: String,
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
