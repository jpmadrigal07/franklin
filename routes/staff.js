const express = require("express");
const router = express.Router();
const Staff = require("../models/staff");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/staff
// @desc    Get All Staff
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllStaff = await Staff.find(condition);
    res.json(getAllStaff);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/staff/add
// @desc    Add A Staff
// @access  Private
router.post("/", async (req, res) => {
  const { userId, name } = req.body;

  if (userId && name) {
    const newStaff = new Staff({
      userId,
      name,
    });
    try {
      const getStaffUserId = await Staff.find({
        userId,
        deletedAt: {
          $exists: false,
        },
      });
      const getStaffName = await Staff.find({
        name,
        deletedAt: {
          $exists: false,
        },
      });
      if (getStaffUserId.length === 0 && getStaffName.length === 0) {
        const createStaff = await newStaff.save();
        res.json(createStaff);
      } else {
        throw new Error("Staff must be unique");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are either invalid or empty");
  }
});

// @route   PATCH api/staff/:id
// @desc    Update A Staff
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateStaff = await Staff.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateStaff);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Staff cannot be found");
  }
});

// @route   DELETE api/staff/:id
// @desc    Delete A Staff
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getStaff = await Staff.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getStaff.length > 0) {
      const deleteStaff = await Staff.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteStaff);
    } else {
      throw new Error("Staff is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
