const express = require("express");
const router = express.Router();
const OrderWash = require("../models/orderWash");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/orderWash
// @desc    Get All OrderWash
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllOrderWash = await OrderWash.find(condition)
      .populate("washId")
      .sort({
        createdAt: -1,
      });
    res.json(getAllOrderWash);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/orderWash/add
// @desc    Add A OrderWash
// @access  Private
router.post("/", async (req, res) => {
  const { jobOrderNumber, washId, machineNumber, qty, total } = req.body;

  if (jobOrderNumber && washId && qty && total) {
    const newOrderWash = new OrderWash({
      jobOrderNumber,
      washId,
      machineNumber,
      qty,
      total,
    });
    try {
      const getOrderWash = await OrderWash.find({
        jobOrderNumber,
        washId,
        deletedAt: {
          $exists: false,
        },
      });
      if (getOrderWash.length === 0) {
        const createOrderWash = await newOrderWash.save();
        res.json(createOrderWash);
      } else {
        throw new Error("Wash already exist on the job order");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are empty");
  }
});

// @route   PATCH api/orderWash/:id
// @desc    Update A OrderWash
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateOrderWash = await OrderWash.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateOrderWash);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Wash cannot be found");
  }
});

// @route   PATCH api/order/:id
// @desc    Update A Order
// @access  Private
router.patch("/bulk/dashboard", async (req, res) => {
  const { bulk } = req.body;
  if (bulk && bulk.length > 0) {
    try {
      const updateWash = await OrderWash.bulkWrite(bulk);
      res.json(updateWash);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Wash is empty");
  }
});

// @route   DELETE api/orderWash/:id
// @desc    Delete A OrderWash
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getOrderWash = await OrderWash.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getOrderWash.length > 0) {
      const deleteOrderWash = await OrderWash.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteOrderWash);
    } else {
      throw new Error("Wash is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
