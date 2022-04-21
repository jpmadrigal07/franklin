const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");
const ObjectId = require("mongoose").Types.ObjectId;

// @route   GET api/order
// @desc    Get All Order
// @access  Public
router.get("/", async (req, res) => {
  const condition = req.query.condition ? JSON.parse(req.query.condition) : {};
  if (!condition.deletedAt) {
    condition.deletedAt = {
      $exists: false,
    };
  }
  if (condition.customerId) {
    condition.customerId = ObjectId(condition.customerId);
  }
  if (condition._id) {
    condition._id = ObjectId(condition._id);
  }
  try {
    const getAllOrder = await Order.aggregate([
      { $match: condition },
      {
        $lookup: {
          from: "staffs",
          localField: "staffId",
          foreignField: "_id",
          as: "staffId",
        },
      },
      {
        $unwind: {
          path: "$staffId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "laundries",
          localField: "laundryId",
          foreignField: "_id",
          as: "laundryId",
        },
      },
      {
        $unwind: {
          path: "$laundryId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customerId",
        },
      },
      {
        $unwind: {
          path: "$customerId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "folders",
          localField: "folderId",
          foreignField: "_id",
          as: "folderId",
        },
      },
      {
        $unwind: {
          path: "$folderId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "staffs",
          localField: "folderId.staffId",
          foreignField: "_id",
          as: "folderId.staffId",
        },
      },
      {
        $unwind: {
          path: "$folderId.staffId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "orderwashes",
          localField: "jobOrderNumber",
          foreignField: "jobOrderNumber",
          as: "orderWash",
        },
      },
      {
        $unwind: {
          path: "$orderWash",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "washes",
          localField: "orderWash.washId",
          foreignField: "_id",
          as: "orderWash.washId",
        },
      },
      {
        $unwind: {
          path: "$orderWash.washId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "orderdries",
          localField: "jobOrderNumber",
          foreignField: "jobOrderNumber",
          as: "orderDry",
        },
      },
      {
        $unwind: {
          path: "$orderDry",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "dries",
          localField: "orderDry.dryId",
          foreignField: "_id",
          as: "orderDry.dryId",
        },
      },
      {
        $unwind: {
          path: "$orderDry.dryId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "orderitems",
          localField: "jobOrderNumber",
          foreignField: "jobOrderNumber",
          as: "orderItem",
        },
      },
      {
        $unwind: {
          path: "$orderItem",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "inventories",
          localField: "orderItem.inventoryId",
          foreignField: "_id",
          as: "orderItem.inventoryId",
        },
      },
      {
        $unwind: {
          path: "$orderItem.inventoryId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "orderdiscounts",
          localField: "jobOrderNumber",
          foreignField: "jobOrderNumber",
          as: "orderDiscount",
        },
      },
      {
        $lookup: {
          from: "orderaddons",
          localField: "jobOrderNumber",
          foreignField: "jobOrderNumber",
          as: "orderAddOn",
        },
      },
      {
        $group: {
          _id: "$_id",
          staffId: { $first: "$staffId" },
          customerId: { $first: "$customerId" },
          jobOrderNumber: { $first: "$jobOrderNumber" },
          laundryId: { $first: "$laundryId" },
          folderId: { $first: "$folderId" },
          weight: { $first: "$weight" },
          amountDue: { $first: "$amountDue" },
          paidStatus: { $first: "$paidStatus" },
          orderStatus: { $first: "$orderStatus" },
          claimStatus: { $first: "$claimStatus" },
          createdAt: { $first: "$createdAt" },
          deletedAt: { $first: "$deletedAt" },
          updatedAt: { $first: "$updatedAt" },
          payment: { $first: "$payment" },
          release: { $first: "$release" },
          foldCompleted: { $first: "$foldCompleted" },
          orderReceived: { $first: "$orderReceived" },
          washCompleted: { $first: "$washCompleted" },
          dryCompleted: { $first: "$dryCompleted" },
          orderWash: { $first: "$orderWash" },
          orderDry: { $first: "$orderDry" },
          orderItem: { $push: "$orderItem" },
          orderDiscount: { $first: "$orderDiscount" },
          orderAddOn: { $first: "$orderAddOn" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    res.json(getAllOrder);
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

// @route   POST api/order/add
// @desc    Add A Order
// @access  Private
router.post("/", async (req, res) => {
  const {
    staffId,
    laundryId,
    customerId,
    folderId,
    jobOrderNumber,
    weight,
    amountDue,
    plasticBag,
    orderReceived,
    washCompleted,
    dryCompleted,
    foldCompleted,
    payment,
    release,
    paidStatus,
    orderStatus,
    claimStatus,
  } = req.body;

  if (staffId && customerId && jobOrderNumber && weight) {
    const newOrder = new Order({
      staffId,
      customerId,
      jobOrderNumber,
      laundryId,
      folderId,
      weight,
      amountDue,
      plasticBag,
      orderReceived,
      washCompleted,
      dryCompleted,
      foldCompleted,
      payment,
      release,
      paidStatus,
      orderStatus,
      claimStatus,
    });
    try {
      const getOrder = await Order.find({
        jobOrderNumber,
        deletedAt: {
          $exists: false,
        },
      });
      if (getOrder.length === 0) {
        const createOrder = await newOrder.save();
        res.json(createOrder);
      } else {
        throw new Error("Order must be unique");
      }
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Required values are empty");
  }
});

// @route   PATCH api/order/:id
// @desc    Update A Order
// @access  Private
router.patch("/:id", async (req, res) => {
  const condition = req.body;
  if (!isEmpty(condition)) {
    try {
      const updateOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: condition,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      res.json(updateOrder);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Order cannot be found");
  }
});

// @route   PATCH api/order/:id
// @desc    Update A Order
// @access  Private
router.patch("/bulk/dashboard", async (req, res) => {
  const { bulk } = req.body;
  if (bulk && bulk.length > 0) {
    try {
      const updateOrder = await Order.bulkWrite(bulk);
      res.json(updateOrder);
    } catch ({ message: errMessage }) {
      const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
      res.status(500).json(message);
    }
  } else {
    res.status(500).json("Order is empty");
  }
});

// @route   DELETE api/order/:id
// @desc    Delete A Order
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const getOrder = await Order.find({
      _id: req.params.id,
      deletedAt: {
        $exists: false,
      },
    });
    if (getOrder.length > 0) {
      const deleteOrder = await Order.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      });
      res.json(deleteOrder);
    } else {
      throw new Error("Order is already deleted");
    }
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

module.exports = router;
