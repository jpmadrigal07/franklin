const express = require("express");
const router = express.Router();
const User = require("../models/user");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

// @route   GET api/user
// @desc    Get All User
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllUser = await User.find(condition);
    res.json(getAllUser);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/user/add
// @desc    Add A User
// @access  Private
router.post("/", async (req, res) => {
  const { username, password, userType } = req.body;
  if (username && password && userType) {
    const newUser = new User({
      username,
      password,
      userType,
    });
    try {
      const getUser = await User.find({
        username,
        deletedAt: {
          $exists: false,
        },
      });
      if (getUser.length === 0) {
        const createUser = await newUser.save();
        res.json(createUser);
      } else {
        throw new Error("Username must be unique");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are either invalid or empty");
  }
});

// @route   POST api/user/add
// @desc    Add A User
// @access  Private
router.post("/verify-password", async (req, res) => {
  const { password } = req.body;
  if (password) {
    try {
      const getUser = await User.find({
        password,
        userType: "Admin",
        deletedAt: {
          $exists: false,
        },
      });
      if (getUser.length > 0) {
        res.json("Password was verified");
      } else {
        throw new Error("Wrong password");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are either invalid or empty");
  }
});

// @route   PATCH api/user/:id
// @desc    Update A User
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateUser);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("User cannot be found");
  }
});

// @route   DELETE api/user/:id
// @desc    Delete A User
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getUser = await User.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getUser.length > 0) {
      const deleteUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteUser);
    } else {
      throw new Error("User is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
