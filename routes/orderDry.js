const express = require("express");
const router = express.Router();
const OrderDry = require("../models/orderDry");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/orderDry
// @desc    Get All OrderDry
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllOrderDry = await OrderDry.find(condition)
      .populate("dryId")
      .sort({
        createdAt: -1,
      });
    res.json(getAllOrderDry);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/orderDry/add
// @desc    Add A OrderDry
// @access  Private
router.post("/", async (req, res) => {
  const { jobOrderNumber, dryId, machineNumber, qty, total } = req.body;

  if (jobOrderNumber && dryId && machineNumber && qty && total) {
    const newOrderDry = new OrderDry({
      jobOrderNumber,
      dryId,
      machineNumber,
      qty,
      total,
    });
    try {
      const getOrderDry = await OrderDry.find({
        jobOrderNumber,
        dryId,
        deletedAt: {
          $exists: false,
        },
      });
      if (getOrderDry.length === 0) {
        const createOrderDry = await newOrderDry.save();
        res.json(createOrderDry);
      } else {
        throw new Error("Dry already exist on the job order");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are empty");
  }
});

// @route   PATCH api/orderDry/:id
// @desc    Update A OrderDry
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateOrderDry = await OrderDry.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateOrderDry);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Dry cannot be found");
  }
});

// @route   PATCH api/order/:id
// @desc    Update A Order
// @access  Private
router.patch("/bulk/dashboard", async (req, res) => {
  const { bulk } = req.body;
  if (bulk && bulk.length > 0) {
    try {
      const updateDry = await OrderDry.bulkWrite(bulk);
      res.json(updateDry);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Dry is empty");
  }
});

// @route   DELETE api/orderDry/:id
// @desc    Delete A OrderDry
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getOrderDry = await OrderDry.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getOrderDry.length > 0) {
      const deleteOrderDry = await OrderDry.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteOrderDry);
    } else {
      throw new Error("Dry is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
