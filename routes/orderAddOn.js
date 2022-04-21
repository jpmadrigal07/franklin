const express = require("express");
const router = express.Router();
const OrderAddOn = require("../models/orderAddOn");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/orderAddOn
// @desc    Get All OrderAddOn
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllOrderAddOn = await OrderAddOn.find(condition)
      .populate("addOnId")
      .sort({
        createdAt: -1,
      });
    res.json(getAllOrderAddOn);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/orderAddOn/add
// @desc    Add A OrderAddOn
// @access  Private
router.post("/", async (req, res) => {
  const { jobOrderNumber, addOnId, machineNumber, qty, total } = req.body;

  if (jobOrderNumber && addOnId && qty && total) {
    const newOrderAddOn = new OrderAddOn({
      jobOrderNumber,
      addOnId,
      machineNumber,
      qty,
      total,
    });
    try {
      const createOrderAddOn = await newOrderAddOn.save();
      res.json(createOrderAddOn);
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
    const bulkOrderAddOn = await OrderAddOn.insertMany(bulk, {
      ordered: false,
    });
    res.json(bulkOrderAddOn);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   PATCH api/orderAddOn/:id
// @desc    Update A OrderAddOn
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateOrderAddOn = await OrderAddOn.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateOrderAddOn);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Add on cannot be found");
  }
});

// @route   DELETE api/orderAddOn/:id
// @desc    Delete A OrderAddOn
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getOrderAddOn = await OrderAddOn.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getOrderAddOn.length > 0) {
      const deleteOrderAddOn = await OrderAddOn.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            deletedAt: Date.now(),
          },
        }
      );
      res.json(deleteOrderAddOn);
    } else {
      throw new Error("Add on is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
