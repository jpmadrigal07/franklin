const express = require("express");
const router = express.Router();
const Discount = require("../models/discount");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/discount
// @desc    Get All Discount
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllDiscount = await Discount.find(condition).sort({
      createdAt: -1,
    });
    res.json(getAllDiscount);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/discount/add
// @desc    Add A Discount
// @access  Private
router.post("/", async (req, res) => {
  const { type, price } = req.body;

  if (type && price) {
    const newDiscount = new Discount({
      type,
      price,
    });
    try {
      const getDiscount = await Discount.find({
        type,
        deletedAt: {
          $exists: false,
        },
      });
      if (getDiscount.length === 0) {
        const createDiscount = await newDiscount.save();
        res.json(createDiscount);
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

// @route   PATCH api/discount/:id
// @desc    Update A Discount
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateDiscount = await Discount.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateDiscount);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Discount cannot be found");
  }
});

// @route   DELETE api/discount/:id
// @desc    Delete A Discount
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getDiscount = await Discount.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getDiscount.length > 0) {
      const deleteDiscount = await Discount.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteDiscount);
    } else {
      throw new Error("Discount is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
