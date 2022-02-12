const express = require("express");
const router = express.Router();
const MainCampus = require("../models/mainCampus");
const isNil = require("lodash/isNil");
const isEmpty = require("lodash/isEmpty");

// @route   GET api/user
// @desc    Get All MainCampus
// @access  Public
router.get("/", async (req, res) => {
  const condition = !isNil(req.query.condition) ? JSON.parse(req.query.condition) : {};
  if (isNil(condition.deletedAt)) {
      condition.deletedAt = {
          $exists: false
      }
  }
  try {
    const getAllMainCampus = await MainCampus.find(condition);
    res.json({
      dbRes: getAllMainCampus,
      isSuccess: true
    });
  } catch (error) {
    res.json({
      dbRes: error.message,
      isSuccess: false
    });
  }
});

// @route   GET api/MainCampus/:id
// @desc    Get Single MainCampus
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const getMainCampus = await MainCampus.findById({
      _id: req.params.id,
      deletedAt: {
        $exists: false
      }
    });
    res.json({
      dbRes: getMainCampus,
      isSuccess: true
    });
  } catch (error) {
    res.json({
      dbRes: error.message,
      isSuccess: false
    });
  }
});

// @route   POST api/MainCampus/add
// @desc    Add A MainCampus
// @access  Private
router.post("/", async (req, res) => {
  const campusName = req.body.campusName;
  const schoolName = req.body.schoolName;
  const email = req.body.email;
  const mobileNumber = req.body.mobileNumber;
  const currency = req.body.currency;
  const currencySymbol = req.body.currencySymbol;
  const city = req.body.city;
  const state = req.body.state;
  const address = req.body.address
  if (!isNil(campusName) && !isNil(schoolName) && !isNil(email) && !isNil(mobileNumber) && !isNil(currency) && !isNil(currencySymbol) && !isNil(city) && !isNil(state) && !isNil(address)) {
    const newMainCampus = new MainCampus({
      campusName,
      schoolName,
      email,
      mobileNumber,
      currency,
      currencySymbol,
      city,
      state,
      address
    });
    try {
      const getMainCampus = await MainCampus.find({
        campusName,
        deletedAt: {
          $exists: false
        }
      });
      if (getMainCampus.length === 0) {
        const createMainCampus = await newMainCampus.save();
        res.json({
          dbRes: createMainCampus,
          isSuccess: true
        });
      } else {
        res.json({
          dbRes: "Campus name must be unique",
          isSuccess: false
        });
      }
    } catch (console) {
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

// @route   PUT api/MainCampus/:id
// @desc    Update A MainCampus
// @access  Private
router.put("/:id", async (req, res) => {
    const campusName = req.body.campusName;
    const schoolName = req.body.schoolName;
    const email = req.body.email;
    const mobileNumber = req.body.mobileNumber;
    const currency = req.body.currency;
    const currencySymbol = req.body.currencySymbol;
    const city = req.body.city;
    const state = req.body.state;
    const address = req.body.address
  if (!isNil(campusName) && !isNil(schoolName) && !isNil(email) && !isNil(mobileNumber) && !isNil(currency) && !isNil(currencySymbol) && !isNil(city) && !isNil(state) && !isNil(address)) {
    try {
      const getMainCampus = await MainCampus.find({
        campusName,
        deletedAt: {
          $exists: false
        }
      });
      if (getMainCampus.length === 0) {
        const updateMainCampus = await MainCampus.findByIdAndUpdate(req.params.id, {
          $set: {
            campusName,
            schoolName,
            email,
            mobileNumber,
            currency,
            currencySymbol,
            city,
            state,
            address,
            createdAt,
            updatedAt: Date.now,
            deletedAt
          },
        });
        res.json({
          dbRes: updateMainCampus,
          isSuccess: true
        });
      } else {
        res.json({
          dbRes: "Campus name must be unique",
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

// @route   PATCH api/MainCampus/:id
// @desc    Update A MainCampus
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
        const updateMainCampus = await MainCampus.findByIdAndUpdate(req.params.id, {
          $set: condition,
          updatedAt: Date.now(),
        });
        res.json({
          dbRes: updateMainCampus,
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
      dbRes: "Course Cannot be found",
      isSuccess: false
    });
  }
});

// @route   DELETE api/MainCampus/:id
// @desc    Delete A MainCampus
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getMainCampus = await MainCampus.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false
      }
    });
    if (getMainCampus.length > 0) {
      const deleteMainCampus = await MainCampus.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json({
        dbRes: deleteMainCampus,
        isSuccess: true
      });
    } else {
      res.json({
        dbRes: "Campus is already deleted",
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