const express = require("express");
const router = express.Router();
const CampusCollege = require("../models/campusCollege");
const isNil = require("lodash/isNil");
const isEmpty = require("lodash/isEmpty");

// @route   GET api/user
// @desc    Get All CampusCollege
// @access  Public
router.get("/", async (req, res) => {
  const condition = !isNil(req.query.condition) ? JSON.parse(req.query.condition) : {};
  if (isNil(condition.deletedAt)) {
      condition.deletedAt = {
          $exists: false
      }
  }
  try {
    const getAllCampusCollege = await CampusCollege.find(condition);
    res.json({
      dbRes: getAllCampusCollege,
      isSuccess: true
    });
  } catch (error) {
    res.json({
      dbRes: error.message,
      isSuccess: false
    });
  }
});

// @route   GET api/CampusCollege/:id
// @desc    Get Single CampusCollege
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const getCampusCollege = await CampusCollege.findById({
      _id: req.params.id,
      deletedAt: {
        $exists: false
      }
    });
    res.json({
      dbRes: getCampusCollege,
      isSuccess: true
    });
  } catch (error) {
    res.json({
      dbRes: error.message,
      isSuccess: false
    });
  }
});

// @route   POST api/CampusCollege/add
// @desc    Add A CampusCollege
// @access  Private
router.post("/", async (req, res) => {
  const collegeId = req.body.collegeId;
  const campusId = req.body.campusId;
  const campusCollege = {
    collegeId,
    campusId
  };
  if (!isNil(collegeId) && !isNil(campusId)) {
    try {
      const getCampusCollege = await CampusCollege.find({
        collegeId,
        campusId,
        deletedAt: {
          $exists: false
        }
      });
      if (getCampusCollege.length == 0) {
        const newCampusCollege = new CampusCollege(campusCollege);
        const createCampusCollege = await newCampusCollege.save();
        res.json({
          dbRes: createCampusCollege,
          isSuccess: true
        });
      } else {
        res.json({
          dbRes: "College and campus id must be unique",
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

// @route   PUT api/CampusCollege/:id
// @desc    Update A CampusCollege
// @access  Private
router.put("/:id", async (req, res) => {
  const collegeId = req.body.collegeId;
  const campusId = req.body.campusId;
  const campusCollege = {
    collegeId,
    campusId
  };
  if (!isNil(collegeId) && !isNil(campusId)) {
    try {
      const getCampusCollege = await CampusCollege.find({
        collegeId,
        campusId,
        deletedAt: {
          $exists: false
        }
      });
      if (getCampusCollege.length === 0) {
        const updateCampusCollege = await CampusCollege.findByIdAndUpdate(req.params.id, {
          $set: {
            collegeId,
            campusId,
            updatedAt: Date.now(),
          },
        });
        res.json({
          dbRes: updateCampusCollege,
          isSuccess: true
        });
      } else {
        res.json({
          dbRes: "College and campus id must be unique",
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

// @route   PATCH api/CampusCollege/:id
// @desc    Update A CampusCollege
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
        const updateCampusCollege = await CampusCollege.findByIdAndUpdate(req.params.id, {
          $set: condition,
          updatedAt: Date.now(),
        });
        res.json({
          dbRes: updateCampusCollege,
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
      dbRes: "College cannot be found",
      isSuccess: false
    });
  }
});

// @route   DELETE api/CampusCollege/:id
// @desc    Delete A CampusCollege
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getCampusCollege = await CampusCollege.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false
      }
    });
    if (getCampusCollege.length > 0) {
      const deleteCampusCollege = await CampusCollege.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json({
        dbRes: deleteCampusCollege,
        isSuccess: true
      });
    } else {
      res.json({
        dbRes: "College campus is already deleted",
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