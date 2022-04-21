const express = require("express");
const router = express.Router();
const Folder = require("../models/folder");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");
const moment = require("moment");

// @route   GET api/folder
// @desc    Get All Folder
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  try {
    const getAllFolder = await Folder.find(condition).populate("staffId").sort({
      createdAt: -1,
    });
    res.json(getAllFolder);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/folder/add
// @desc    Add A Folder
// @access  Private
router.post("/", async (req, res) => {
  const { staffId } = req.body;

  if (staffId) {
    const newFolder = new Folder({
      staffId,
      timeIn: moment().toString(),
    });
    try {
      const getFolder = await Folder.find({
        timeIn: {
          $gte: new Date(moment().startOf("day").toString()),
          $lt: new Date(moment().endOf("day").toString()),
        },
        timeOut: {
          $exists: false,
        },
        deletedAt: {
          $exists: false,
        },
      });
      if (getFolder.length === 0) {
        const createFolder = await newFolder.save();
        res.json(createFolder);
      } else {
        throw new Error("There is an active folder today");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are empty");
  }
});

// @route   PATCH api/folder/:id
// @desc    Update A Folder
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateFolder = await Folder.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateFolder);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Folder cannot be found");
  }
});

// @route   DELETE api/folder/:id
// @desc    Delete A Folder
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getFolder = await Folder.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getFolder.length > 0) {
      const deleteFolder = await Folder.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteFolder);
    } else {
      throw new Error("Folder is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
