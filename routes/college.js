const express = require("express");
const router = express.Router();
const College = require("../models/college");
const isNil = require("lodash/isNil");
const isEmpty = require("lodash/isEmpty");

// @route   GET api/user
// @desc    Get All College
// @access  Public
router.get("/", async (req, res) => {
  const condition = !isNil(req.query.condition) ? JSON.parse(req.query.condition) : {};
  if (isNil(condition.deletedAt)) {
      condition.deletedAt = {
          $exists: false
      }
  }
  try {
    const getAllCollege = await College.find(condition);
    res.json({
      dbRes: getAllCollege,
      isSuccess: true
    });
  } catch (error) {
    res.json({
      dbRes: error.message,
      isSuccess: false
    });
  }
});

// @route   GET api/College/:id
// @desc    Get Single College
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const getCollege = await College.findById({
      _id: req.params.id,
      deletedAt: {
        $exists: false
      }
    });
    res.json({
      dbRes: getCollege,
      isSuccess: true
    });
  } catch (error) {
    res.json({
      dbRes: error.message,
      isSuccess: false
    });
  }
});

// @route   POST api/College/add
// @desc    Add A College
// @access  Private
router.post("/", async (req, res) => {
  const collegeName = req.body.collegeName;
  const collegeCode = req.body.collegeCode;
  if (!isNil(collegeName) && !isNil(collegeCode)) {
    const newCollege = new College({
      collegeName,
      collegeCode
    });
    try {
      const getCollege = await College.find({
        collegeName,
        deletedAt: {
          $exists: false
        }
      });
      if (getCollege.length === 0) {
        const createCollege = await newCollege.save();
        res.json({
          dbRes: createCollege,
          isSuccess: true
        });
      } else {
        res.json({
          dbRes: "College name must be unique",
          isSuccess: false
        });
      }
    } catch (error) {
      res.json({
        dbRes: error.message,
        isSuccess: false
      });
    }
  } else {
    res.json({
      dbRes: "Required values are either invalid or empty",
      isSuccess: false
    });
  }
});

// @route   PUT api/College/:id
// @desc    Update A College
// @access  Private
router.put("/:id", async (req, res) => {
    const collegeName = req.body.collegeName;
    const collegeCode = req.body.collegeCode;
  if (!isNil(collegeName) && !isNil(collegeCode)) {
    try {
      const getCollege = await College.find({
        collegeName,
        deletedAt: {
          $exists: false
        }
      });
      if (getCollege.length === 0) {
        const updateCollege = await College.findByIdAndUpdate(req.params.id, {
          $set: {
            collegeName,
            collegeCode,
            updatedAt: Date.now(),
          },
        });
        res.json({
          dbRes: updateCollege,
          isSuccess: true
        });
      } else {
        res.json({
          dbRes: "College name must be unique",
          isSuccess: false
        });
      }
    } catch (error) {
      res.json({
        dbRes: error.message,
        isSuccess: false
      });
    }
  } else {
    res.json({
      dbRes: "Required values are either invalid or empty",
      isSuccess: false
    });
  }
});

// @route   PATCH api/College/:id
// @desc    Update A College
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
        const updateCollege = await College.findByIdAndUpdate(req.params.id, {
          $set: condition,
          updatedAt: Date.now(),
        });
        res.json({
          dbRes: updateCollege,
          isSuccess: true
        });
    } catch (error) {
      res.json({
        dbRes: error.message,
        isSuccess: false
      });
    }
  } else {
    res.json({
      dbRes: "College Cannot be found",
      isSuccess: false
    });
  }
});

// @route   DELETE api/College/:id
// @desc    Delete A College
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getCollege = await College.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false
      }
    });
    if (getCollege.length > 0) {
      const deleteCollege = await College.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json({
        dbRes: deleteCollege,
        isSuccess: true
      });
    } else {
      res.json({
        dbRes: "College is already deleted",
        isSuccess: false
      });
    }
  } catch (error) {
    res.json({
      dbRes: error.message,
      isSuccess: false
    });
  }
});

module.exports = router;