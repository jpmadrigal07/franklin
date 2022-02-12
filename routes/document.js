const express = require("express");
const router = express.Router();
const Document = require("../models/document");
const isNil = require("lodash/isNil");
const isEmpty = require("lodash/isEmpty");

// @route   GET api/user
// @desc    Get All Document
// @access  Public
router.get("/", async (req, res) => {
  const condition = !isNil(req.query.condition) ? JSON.parse(req.query.condition) : {};
  if (isNil(condition.deletedAt)) {
      condition.deletedAt = {
          $exists: false
      }
  }
  try {
    const getAllDocument = await Document.find(condition);
    res.json({
      dbRes: getAllDocument,
      isSuccess: true
    });
  } catch (error) {
    res.json({
      dbRes: error.message,
      isSuccess: false
    });
  }
});

// @route   GET api/Document/:id
// @desc    Get Single Document
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const getDocument = await Document.findById({
      _id: req.params.id,
      deletedAt: {
        $exists: false
      }
    });
    res.json({
      dbRes: getDocument,
      isSuccess: true
    });
  } catch (error) {
    res.json({
      dbRes: error.message,
      isSuccess: false
    });
  }
});

// @route   POST api/Document/add
// @desc    Add A Document
// @access  Private
router.post("/", async (req, res) => {
  const fileName = req.body.fileName;
  const isApplyToAllCourse = req.body.isApplyToAllCourse;
  const applyToCourses = req.body.applyToCourses;
  const isApplyToAllAdmitType = req.body.isApplyToAllAdmitType;
  const applyToAdmitTypes = req.body.applyToAdmitTypes;
  const isEnrolleeRequiredToUpload = req.body.isEnrolleeRequiredToUpload;
  const isDocumentEnabled = req.body.isDocumentEnabled;
  
  if (!isNil(fileName)) {
    const newDocument = new Document({
    fileName,
    isApplyToAllCourse,
    applyToCourses,
    isApplyToAllAdmitType,
    applyToAdmitTypes,
    isEnrolleeRequiredToUpload,
    isDocumentEnabled
    });
    try {
      const getDocument = await Document.find({
        fileName,
        applyToCourses,
        deletedAt: {
          $exists: false
        }
      });
      if (getDocument.length === 0) {
        const createDocument = await newDocument.save();
        res.json({
          dbRes: createDocument,
          isSuccess: true
        });
      } else {
        res.json({
          dbRes: "File name and course must be unique",
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

// @route   PUT api/Document/:id
// @desc    Update A Document
// @access  Private
router.put("/:id", async (req, res) => {
  const fileName = req.body.fileName;
  const isApplyToAllCourse = req.body.isApplyToAllCourse;
  const applyToCourses = req.body.applyToCourses;
  const isApplyToAllAdmitType = req.body.isApplyToAllAdmitType;
  const applyToAdmitTypes = req.body.applyToAdmitTypes;
  const isEnrolleeRequiredToUpload = req.body.isEnrolleeRequiredToUpload;
  const isDocumentEnabled = req.body.isDocumentEnabled;
  if (!isNil(fileName) && !isNil(isApplyToAllCourse) && !isNil(applyToCourses) && !isNil(isApplyToAllAdmitType) && !isNil(applyToAdmitTypes) && !isNil(isEnrolleeRequiredToUpload) && !isNil(isDocumentEnabled)) {
    try {
      const getDocument = await Document.find({
        fileName,
        applyToCourses,
        deletedAt: {
          $exists: false
        }
      });
      if (getDocument.length === 0) {
        const updateDocument = await Document.findByIdAndUpdate(req.params.id, {
          $set: {
            fileName,
            isApplyToAllCourse,
            applyToCourses,
            isApplyToAllAdmitType,
            applyToAdmitTypes,
            isEnrolleeRequiredToUpload,
            isDocumentEnabled,
            updatedAt: Date.now(),
          },
        });
        res.json({
          dbRes: updateDocument,
          isSuccess: true
        });
      } else {
        res.json({
          dbRes: "File name and course must be unique",
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

// @route   PATCH api/Document/:id
// @desc    Update A Document
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
        const updateDocument = await Document.findByIdAndUpdate(req.params.id, {
          $set: condition,
          updatedAt: Date.now(),
        });
        res.json({
          dbRes: updateDocument,
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
      dbRes: "Document sannot be found",
      isSuccess: false
    });
  }
});

// @route   DELETE api/Document/:id
// @desc    Delete A Document
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getDocument = await Document.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false
      }
    });
    if (getDocument.length > 0) {
      const deleteDocument = await Document.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json({
        dbRes: deleteDocument,
        isSuccess: true
      });
    } else {
      res.json({
        dbRes: "Document is already deleted",
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