const express = require("express");
const router = express.Router();
const Laundry = require("../models/laundry");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/laundry
// @desc    Get All Laundry
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllLaundry = await Laundry.find(condition).sort({
      createdAt: -1,
    });
    res.json(getAllLaundry);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/laundry/add
// @desc    Add A Laundry
// @access  Private
router.post("/", async (req, res) => {
  const { type, price } = req.body;

  if (type && price) {
    const newLaundry = new Laundry({
      type,
      price,
    });
    try {
      const getLaundry = await Laundry.find({
        type,
        deletedAt: {
          $exists: false,
        },
      });
      if (getLaundry.length === 0) {
        const createLaundry = await newLaundry.save();
        res.json(createLaundry);
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

// @route   PATCH api/laundry/:id
// @desc    Update A Laundry
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateLaundry = await Laundry.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateLaundry);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Laundry cannot be found");
  }
});

// @route   DELETE api/laundry/:id
// @desc    Delete A Laundry
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getLaundry = await Laundry.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getLaundry.length > 0) {
      const deleteLaundry = await Laundry.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteLaundry);
    } else {
      throw new Error("Laundry is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
