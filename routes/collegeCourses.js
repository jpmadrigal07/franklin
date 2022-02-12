const express = require("express");
const router = express.Router();
const CollegeCourses = require("../models/collegeCourses");
const isNil = require("lodash/isNil");
const isEmpty = require("lodash/isEmpty");

// @route   GET api/user
// @desc    Get All CollegeCourses
// @access  Public
router.get("/", async (req, res) => {
  const condition = !isNil(req.query.condition) ? JSON.parse(req.query.condition) : {};
  if (isNil(condition.deletedAt)) {
      condition.deletedAt = {
          $exists: false
      }
  }
  try {
    const getAllCollegeCourses = await CollegeCourses.find(condition);
    res.json({
      dbRes: getAllCollegeCourses,
      isSuccess: true
    });
  } catch (error) {
    res.json({
      dbRes: error.message,
      isSuccess: false
    });
  }
});

// @route   GET api/CollegeCourses/:id
// @desc    Get Single CollegeCourses
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const getCollegeCourses = await CollegeCourses.findById({
      _id: req.params.id,
      deletedAt: {
        $exists: false
      }
    });
    res.json({
      dbRes: getCollegeCourses,
      isSuccess: true
    });
  } catch (error) {
    res.json({
      dbRes: error.message,
      isSuccess: false
    });
  }
});

// @route   POST api/CollegeCourses/add
// @desc    Add A CollegeCourses
// @access  Private
router.post("/", async (req, res) => {
  const collegeId = req.body.collegeId;
  const courseId = req.body.courseId;
  const collegeCourses = {
    collegeId,
    courseId
  };
  if (!isNil(collegeId) && !isNil(courseId)) {
    try {
      const getCollegeCourses = await CollegeCourses.find({
        collegeId,
        courseId,
        deletedAt: {
          $exists: false
        }
      });
      if (getCollegeCourses.length == 0) {
        const newCollegeCourses = new CollegeCourses(collegeCourses);
        const createCollegeCourses = await newCollegeCourses.save();
        res.json({
          dbRes: createCollegeCourses,
          isSuccess: true
        });
      } else {
        res.json({
          dbRes: "Course id must be unique",
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

// @route   PUT api/CollegeCourses/:id
// @desc    Update A CollegeCourses
// @access  Private
router.put("/:id", async (req, res) => {
  const collegeId = req.body.collegeId;
  const courseId = req.body.courseId;
  const collegeCourses = {
    collegeId,
    courseId
  };
  if (!isNil(collegeId) && !isNil(courseId)) {
    try {
      const getCollegeCourses = await CollegeCourses.find({
        collegeId,
        deletedAt: {
          $exists: false
        }
      });
      if (getCollegeCourses.length === 0) {
        const updateCollegeCourses = await CollegeCourses.findByIdAndUpdate(req.params.id, {
          $set: {
            collegeId,
            courseId,
            updatedAt: Date.now(),
          },
        });
        res.json({
          dbRes: updateCollegeCourses,
          isSuccess: true
        });
      } else {
        res.json({
          dbRes: "College id and course id must be unique",
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

// @route   PATCH api/CollegeCourses/:id
// @desc    Update A CollegeCourses
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
        const updateCollegeCourses = await CollegeCourses.findByIdAndUpdate(req.params.id, {
          $set: condition,
          updatedAt: Date.now(),
        });
        res.json({
          dbRes: updateCollegeCourses,
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
      dbRes: "College Course Cannot be found",
      isSuccess: false
    });
  }
});

// @route   DELETE api/CollegeCourses/:id
// @desc    Delete A CollegeCourses
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getCollegeCourses = await CollegeCourses.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false
      }
    });
    if (getCollegeCourses.length > 0) {
      const deleteCollegeCourses = await CollegeCourses.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json({
        dbRes: deleteCollegeCourses,
        isSuccess: true
      });
    } else {
      res.json({
        dbRes: "College Course is already deleted",
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