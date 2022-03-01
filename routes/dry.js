const express = require("express");
const router = express.Router();
const Dry = require("../models/dry");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/dry
// @desc    Get All Dry
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllDry = await Dry.find(condition).sort({
      createdAt: -1,
    });
    res.json(getAllDry);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/dry/add
// @desc    Add A Dry
// @access  Private
router.post("/", async (req, res) => {
  const { type, price } = req.body;

  if (type && price) {
    const newDry = new Dry({
      type,
      price,
    });
    try {
      const getDry = await Dry.find({
        type,
        deletedAt: {
          $exists: false,
        },
      });
      if (getDry.length === 0) {
        const createDry = await newDry.save();
        res.json(createDry);
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

// @route   PATCH api/dry/:id
// @desc    Update A Dry
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateDry = await Dry.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateDry);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Dry cannot be found");
  }
});

// @route   DELETE api/dry/:id
// @desc    Delete A Dry
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getDry = await Dry.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getDry.length > 0) {
      const deleteDry = await Dry.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteDry);
    } else {
      throw new Error("Dry is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
