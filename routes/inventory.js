const express = require("express");
const router = express.Router();
const Inventory = require("../models/inventory");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/inventory
// @desc    Get All Inventory
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllInventory = await Inventory.find(condition).sort({
      createdAt: -1,
    });
    res.json(getAllInventory);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/inventory/add
// @desc    Add A Inventory
// @access  Private
router.post("/", async (req, res) => {
  const { type, stockCode, name, unitCost, stock } = req.body;

  if (type && stockCode && name && unitCost && stock) {
    const newInventory = new Inventory({
      type,
      stockCode,
      name,
      unitCost,
      stock,
    });
    try {
      const getInventory = await Inventory.find({
        stockCode,
        name,
        deletedAt: {
          $exists: false,
        },
      });
      if (getInventory.length === 0) {
        const createInventory = await newInventory.save();
        res.json(createInventory);
      } else {
        throw new Error("Code and name must be unique");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are empty");
  }
});

// @route   PATCH api/inventory/:id
// @desc    Update A Inventory
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateInventory = await Inventory.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateInventory);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Item cannot be found");
  }
});

// @route   DELETE api/inventory/:id
// @desc    Delete A Inventory
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getInventory = await Inventory.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getInventory.length > 0) {
      const deleteInventory = await Inventory.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteInventory);
    } else {
      throw new Error("Item is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
