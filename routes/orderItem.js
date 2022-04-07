const express = require("express");
const router = express.Router();
const OrderItem = require("../models/orderItem");
const Inventory = require("../models/inventory");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/orderItem
// @desc    Get All OrderItem
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllOrderItem = await OrderItem.find(condition)
      .populate("inventoryId")
      .sort({
        createdAt: -1,
      });
    res.json(getAllOrderItem);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/orderItem/add
// @desc    Add A OrderItem
// @access  Private
router.post("/", async (req, res) => {
  const { jobOrderNumber, inventoryId, qty, total } = req.body;

  if (jobOrderNumber && inventoryId && qty && total) {
    const newOrderItem = new OrderItem({
      jobOrderNumber,
      inventoryId,
      qty,
      total,
    });
    try {
      const getOrderItem = await OrderItem.find({
        jobOrderNumber,
        inventoryId,
        qty,
        total,
        deletedAt: {
          $exists: false,
        },
      });
      if (getOrderItem.length === 0) {
        const createOrderItem = await newOrderItem.save();
        if (createOrderItem) {
          await Inventory.updateOne(
            { _id: inventoryId },
            { $inc: { stock: -Math.abs(qty) } }
          );
        }
        res.json(createOrderItem);
      } else {
        throw new Error("Inventory already exist on the job order");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are empty");
  }
});

// @route   PATCH api/orderItem/:id
// @desc    Update A OrderItem
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateOrderItem = await OrderItem.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateOrderItem);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Item cannot be found");
  }
});

// @route   DELETE api/orderItem/:id
// @desc    Delete A OrderItem
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getOrderItem = await OrderItem.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getOrderItem.length > 0) {
      const deleteOrderItem = await OrderItem.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteOrderItem);
    } else {
      throw new Error("Item is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
