const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/order
// @desc    Get All Order
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllOrder = await Order.find(condition)
      .populate("customerId")
      .populate("staffId")
      .sort({
        createdAt: -1,
      });
    res.json(getAllOrder);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/order/add
// @desc    Add A Order
// @access  Private
router.post("/", async (req, res) => {
  const {
    staffId,
    laundryId,
    customerId,
    jobOrderNumber,
    weight,
    amountDue,
    orderReceived,
    washCompleted,
    dryCompleted,
    foldCompleted,
    payment,
    release,
    paidStatus,
    orderStatus,
    claimStatus,
  } = req.body;

  if (staffId && customerId && jobOrderNumber && weight) {
    const newOrder = new Order({
      staffId,
      customerId,
      jobOrderNumber,
      laundryId,
      weight,
      amountDue,
      orderReceived,
      washCompleted,
      dryCompleted,
      foldCompleted,
      payment,
      release,
      paidStatus,
      orderStatus,
      claimStatus,
    });
    try {
      const getOrder = await Order.find({
        jobOrderNumber,
        deletedAt: {
          $exists: false,
        },
      });
      if (getOrder.length === 0) {
        const createOrder = await newOrder.save();
        res.json(createOrder);
      } else {
        throw new Error("Order must be unique");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are empty");
  }
});

// @route   PATCH api/order/:id
// @desc    Update A Order
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateOrder);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Order cannot be found");
  }
});

// @route   DELETE api/order/:id
// @desc    Delete A Order
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getOrder = await Order.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getOrder.length > 0) {
      const deleteOrder = await Order.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteOrder);
    } else {
      throw new Error("Order is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
