const express = require("express");
const router = express.Router();
const Wash = require("../models/wash");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/wash
// @desc    Get All Wash
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllWash = await Wash.find(condition).sort({
      createdAt: -1,
    });
    res.json(getAllWash);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/wash/add
// @desc    Add A Wash
// @access  Private
router.post("/", async (req, res) => {
  const { type, price } = req.body;

  if (type && price) {
    const newWash = new Wash({
      type,
      price,
    });
    try {
      const getWash = await Wash.find({
        type,
        deletedAt: {
          $exists: false,
        },
      });
      if (getWash.length === 0) {
        const createWash = await newWash.save();
        res.json(createWash);
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

// @route   PATCH api/wash/:id
// @desc    Update A Wash
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateWash = await Wash.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateWash);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Wash cannot be found");
  }
});

// @route   DELETE api/wash/:id
// @desc    Delete A Wash
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getWash = await Wash.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getWash.length > 0) {
      const deleteWash = await Wash.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteWash);
    } else {
      throw new Error("Wash is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
