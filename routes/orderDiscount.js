const express = require("express");
const router = express.Router();
const OrderDiscount = require("../models/orderDiscount");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/orderDiscount
// @desc    Get All OrderDiscount
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllOrderDiscount = await OrderDiscount.find(condition)
      .populate("discountId")
      .sort({
        createdAt: -1,
      });
    res.json(getAllOrderDiscount);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/orderDiscount/add
// @desc    Add A OrderDiscount
// @access  Private
router.post("/", async (req, res) => {
  const { jobOrderNumber, discountId, qty, total } = req.body;

  if (jobOrderNumber && discountId && qty && total) {
    const newOrderDiscount = new OrderDiscount({
      jobOrderNumber,
      discountId,
      qty,
      total,
    });
    try {
      const createOrderDiscount = await newOrderDiscount.save();
      res.json(createOrderDiscount);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are empty");
  }
});

// @route   POST api/orderAddOn/add
// @desc    Add A OrderAddOn
// @access  Private
router.post("/bulk", async (req, res) => {
  const { bulk } = req.body;

  try {
    const buldOrderDiscount = await OrderDiscount.insertMany(bulk, {
      ordered: false,
    });
    res.json(buldOrderDiscount);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   PATCH api/orderDiscount/:id
// @desc    Update A OrderDiscount
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateOrderDiscount = await OrderDiscount.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateOrderDiscount);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Discount cannot be found");
  }
});

// @route   DELETE api/orderDiscount/:id
// @desc    Delete A OrderDiscount
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getOrderDiscount = await OrderDiscount.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getOrderDiscount.length > 0) {
      const deleteOrderDiscount = await OrderDiscount.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            deletedAt: Date.now(),
          },
        }
      );
      res.json(deleteOrderDiscount);
    } else {
      throw new Error("Discount is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
