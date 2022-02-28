const express = require("express");
const router = express.Router();
const AddOn = require("../models/addOn");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/addOn
// @desc    Get All AddOn
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllAddOn = await AddOn.find(condition).sort({
      createdAt: -1,
    });
    res.json(getAllAddOn);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/addOn/add
// @desc    Add A AddOn
// @access  Private
router.post("/", async (req, res) => {
  const { type, price } = req.body;

  if (type && price) {
    const newAddOn = new AddOn({
      type,
      price,
    });
    try {
      const getAddOn = await AddOn.find({
        type,
        deletedAt: {
          $exists: false,
        },
      });
      if (getAddOn.length === 0) {
        const createAddOn = await newAddOn.save();
        res.json(createAddOn);
      } else {
        throw new Error("Name must be unique");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are empty");
  }
});

// @route   PATCH api/addOn/:id
// @desc    Update A AddOn
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateAddOn = await AddOn.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateAddOn);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("AddOn cannot be found");
  }
});

// @route   DELETE api/addOn/:id
// @desc    Delete A AddOn
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getAddOn = await AddOn.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getAddOn.length > 0) {
      const deleteAddOn = await AddOn.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteAddOn);
    } else {
      throw new Error("AddOn is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
