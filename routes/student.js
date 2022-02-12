const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const User = require("../models/user");
const isNil = require("lodash/isNil");
const isEmpty = require("lodash/isEmpty");

// @route   GET api/user
// @desc    Get All Student
// @access  Public
router.get("/", async (req, res) => {
  const condition = !isNil(req.query.condition) ? JSON.parse(req.query.condition) : {};
  if (isNil(condition.deletedAt)) {
      condition.deletedAt = {
          $exists: false
      }
  }
  try {
    const getAllStudent = await Student.find(condition);
    res.json({
      dbRes: getAllStudent,
      isSuccess: true
    });
  } catch (error) {
    res.json({
      dbRes: error.message,
      isSuccess: false
    });
  }
});

// @route   GET api/areaPrice/:id
// @desc    Get Single Student
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const getStudent = await Student.findById({
      _id: req.params.id,
      deletedAt: {
        $exists: false
      }
    });
    res.json({
      dbRes: getStudent,
      isSuccess: true
    });
  } catch (error) {
    res.json({
      dbRes: error.message,
      isSuccess: false
    });
  }
});

// @route   POST api/areaPrice/add
// @desc    Add A Student
// @access  Private
router.post("/", async (req, res) => {
  const lrn = req.body.lrn;
  const campusId = req.body.campusId;
  const admitType = req.body.admitType;
  const typeOfStudent = req.body.typeOfStudent;
  const email = req.body.email;
  const password = req.body.password;
  const userType = "Student";
  if (!isNil(campusId) && !isNil(admitType) && !isNil(typeOfStudent) && !isNil(email) && !isNil(password)) {
    const newUser = new User({
      email,
      password,
      userType
    });
    try {
      const getUser = await User.find({
        email,
        deletedAt: {
          $exists: false
        }
      });
      if (getUser.length === 0) {
        const createUser = await newUser.save();
        if(createUser) {
          const newStudent = new Student({
            userId: createUser._id,
            lrn,
            campusId,
            admitType,
            typeOfStudent
          });
          const createStudent = await newStudent.save();
          const studentAccount = {user: createUser, student: createStudent}
          res.json({
            dbRes: studentAccount,
            isSuccess: true
          });
        }
      } else {
        res.json({
          dbRes: "Email is already in use",
          isSuccess: false
        });
      }
    } catch (error) {
      res.json({
        dbRes: err.message,
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

// @route   PUT api/areaPrice/:id
// @desc    Update A Student
// @access  Private
router.put("/:id", async (req, res) => {
  const lrn = req.body.lrn;
  const campus = req.body.campus;
  const admitType = req.body.admitType;
  const typeOfStudent = req.body.typeOfStudent;
  if (!isNil(lrn) && !isNil(campus) && !isNil(admitType) && !isNil(typeOfStudent)) {
    try {
      const getStudent = await Student.find({
        lrn,
        deletedAt: {
          $exists: false
        }
      });
      if (getStudent.length > 0) {
        const updateStudent = await Student.findByIdAndUpdate(req.params.id, {
          $set: {
            lrn,
            campus,
            admitType,
            typeOfStudent,
            updatedAt: Date.now()
          },
        });
        res.json({
          dbRes: updateStudent,
          isSuccess: true
        });
      } else {
        res.json({
          dbRes: "Student cannot be found",
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

// @route   PATCH api/areaPrice/:id
// @desc    Update A Student
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
        const updateStudent = await Student.findByIdAndUpdate(req.params.id, {
          $set: condition,
          updatedAt: Date.now(),
        }, {new: true});
        res.json({
          dbRes: updateStudent,
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
      dbRes: "Required values are either invalid or empty",
      isSuccess: false
    });
  }
});

// @route   DELETE api/areaPrice/:id
// @desc    Delete A Student
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getStudent = await Student.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false
      }
    });
    if (getStudent.length > 0) {
      const deleteStudent = await Student.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json({
        dbRes: deleteStudent,
        isSuccess: true
      });
    } else {
      res.json({
        dbRes: "Student is already deleted",
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