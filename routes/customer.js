const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/customer
// @desc    Get All Customer
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.conditions ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllCustomer = await Customer.find(condition);
    res.json(getAllCustomer);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/customer/add
// @desc    Add A Customer
// @access  Private
router.post("/", async (req, res) => {
  const {
    firstName,
    lastName,
    street,
    barangayVillage,
    city,
    postalZipcode,
    birthday,
    contactNumber,
    landline,
    email,
    notes,
  } = req.body;

  if (
    firstName &&
    lastName &&
    street &&
    barangayVillage &&
    city &&
    postalZipcode &&
    birthday &&
    contactNumber &&
    landline &&
    email
  ) {
    const newCustomer = new Customer({
      firstName,
      lastName,
      street,
      barangayVillage,
      city,
      postalZipcode,
      birthday,
      contactNumber,
      landline,
      email,
      notes,
    });
    try {
      const getCustomer = await Customer.find({
        firstName,
        lastName,
        email,
        deletedAt: {
          $exists: false,
        },
      });
      if (getCustomer.length === 0) {
        const createCustomer = await newCustomer.save();
        res.json(createCustomer);
      } else {
        throw new Error("Username must be unique");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are either invalid or empty");
  }
});

// @route   PATCH api/customer/:id
// @desc    Update A Customer
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateCustomer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateCustomer);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Customer cannot be found");
  }
});

// @route   DELETE api/customer/:id
// @desc    Delete A Customer
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getCustomer = await Customer.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getCustomer.length > 0) {
      const deleteCustomer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteCustomer);
    } else {
      throw new Error("Customer is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
