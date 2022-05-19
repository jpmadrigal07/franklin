const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Order = require("../models/order");
const Laundry = require("../models/laundry");
const isEmpty = require("lodash/isEmpty");
const { UNKNOW_ERROR_OCCURED } = require("../constants");
const Excel = require("exceljs");
const FileSaver = require("file-saver");
const moment = require("moment");

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
  const { username, password } = req.body;
  if ((username, password)) {
    try {
      const getUser = await User.find({
        username,
        password,
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

// @route   POST api/user/add
// @desc    Add A User
// @access  Private
router.post("/export-excel", async (req, res) => {
  const { date } = req.body;

  const filename = `Report-${moment(date).format("MMDDYY")}.xlsx`;

  const ordersCondition = {
    createdAt: {
      $gte: new Date(moment(date).startOf("day")),
      $lt: new Date(moment(date).endOf("day")),
    },
    deletedAt: { $exists: false },
    orderStatus: { $ne: "Closed" },
    orderStatus: { $ne: "Canceled" },
  };

  const workBook = new Excel.Workbook();
  const workSheet = workBook.addWorksheet("Reports");

  const row1 = workSheet.getRow(1);
  const row2 = workSheet.getRow(2);
  const row3 = workSheet.getRow(3);
  const customerCol = workSheet.getColumn(1);

  workSheet.getCell("A1").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("B1").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("N1").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("A2").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("B2").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("C2").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("D2").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("I2").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("N2").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("O2").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("P2").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("Q2").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("D3").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("E3").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("F3").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("G3").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("H3").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("I3").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("J3").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("K3").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("L3").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("M3").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  row1.getCell("A").value = "CUSTOMER";
  row1.getCell("B").value = "JOB ORDER";
  row1.getCell("N").value = "PAYMENT";

  workSheet.mergeCells("B1:M1");
  workSheet.mergeCells("N1:Q1");

  workSheet.mergeCells("A2:A3");
  workSheet.mergeCells("B2:B3");
  workSheet.mergeCells("C2:C3");

  row2.getCell("A").value = "CUSTOMER NAME";
  row2.getCell("B").value = "JO NUM";
  row2.getCell("C").value = "DIY/DO";
  row2.getCell("D").value = "WASH";
  row2.getCell("I").value = "DRY";
  row2.getCell("N").value = "DO FEE";
  row2.getCell("O").value = "AMT";
  row2.getCell("P").value = "DISC";
  row2.getCell("Q").value = "TOTAL";

  workSheet.mergeCells("D2:H2");
  workSheet.mergeCells("I2:M2");

  workSheet.mergeCells("N2:N3");
  workSheet.mergeCells("O2:O3");
  workSheet.mergeCells("P2:P3");
  workSheet.mergeCells("Q2:Q3");

  row3.getCell("D").value = "L";
  row3.getCell("E").value = "M";
  row3.getCell("F").value = "H";
  row3.getCell("G").value = "SP";
  row3.getCell("H").value = "RSP";
  row3.getCell("I").value = "R";
  row3.getCell("J").value = "S";
  row3.getCell("K").value = "E";
  row3.getCell("L").value = "R+";
  row3.getCell("M").value = "S+";

  row1.getCell("A").alignment = { horizontal: "center" };
  row1.getCell("B").alignment = { horizontal: "center" };
  row1.getCell("N").alignment = { horizontal: "center" };

  customerCol.width = 26;

  row2.getCell("A").alignment = { horizontal: "center" };
  row2.getCell("B").alignment = { horizontal: "center" };
  row2.getCell("C").alignment = { horizontal: "center" };
  row2.getCell("D").alignment = { horizontal: "center" };
  row2.getCell("I").alignment = { horizontal: "center" };

  row2.getCell("N").alignment = { horizontal: "center" };
  row2.getCell("O").alignment = { horizontal: "center" };
  row2.getCell("P").alignment = { horizontal: "center" };
  row2.getCell("Q").alignment = { horizontal: "center" };

  row3.getCell("D").alignment = { horizontal: "center" };
  row3.getCell("E").alignment = { horizontal: "center" };
  row3.getCell("F").alignment = { horizontal: "center" };
  row3.getCell("G").alignment = { horizontal: "center" };
  row3.getCell("H").alignment = { horizontal: "center" };
  row3.getCell("I").alignment = { horizontal: "center" };
  row3.getCell("J").alignment = { horizontal: "center" };
  row3.getCell("K").alignment = { horizontal: "center" };
  row3.getCell("L").alignment = { horizontal: "center" };
  row3.getCell("M").alignment = { horizontal: "center" };

  workSheet.getCell("A1").font = {
    bold: true,
  };

  workSheet.getCell("B1").font = {
    bold: true,
  };

  workSheet.getCell("N1").font = {
    bold: true,
  };

  workSheet.getCell("A2").font = {
    bold: true,
  };

  workSheet.getCell("B2").font = {
    bold: true,
  };

  workSheet.getCell("C2").font = {
    bold: true,
  };

  workSheet.getCell("D2").font = {
    bold: true,
  };

  workSheet.getCell("I2").font = {
    bold: true,
  };

  workSheet.getCell("N2").font = {
    bold: true,
  };

  workSheet.getCell("O2").font = {
    bold: true,
  };

  workSheet.getCell("P2").font = {
    bold: true,
  };

  workSheet.getCell("Q2").font = {
    bold: true,
  };

  workSheet.getCell("D3").font = {
    bold: true,
  };

  workSheet.getCell("E3").font = {
    bold: true,
  };

  workSheet.getCell("F3").font = {
    bold: true,
  };

  workSheet.getCell("G3").font = {
    bold: true,
  };

  workSheet.getCell("H3").font = {
    bold: true,
  };

  workSheet.getCell("I3").font = {
    bold: true,
  };

  workSheet.getCell("J3").font = {
    bold: true,
  };

  workSheet.getCell("K3").font = {
    bold: true,
  };

  workSheet.getCell("L3").font = {
    bold: true,
  };

  workSheet.getCell("M3").font = {
    bold: true,
  };

  try {
    const getAllOrder = await Order.aggregate([
      { $match: ordersCondition },
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

    const getLaundry = await Laundry.find({
      type: "Drop Off Fee",
      deletedAt: {
        $exists: false,
      },
    });

    const newMappedData = getAllOrder.map((item) => {
      const discount = item.orderDiscount.reduce(function (a, b) {
        return a + b.discountId.price;
      }, 0);

      const regularDry =
        item.orderDry && item.orderDry.dryId.type === "Regular"
          ? item.orderDry.qty
          : "";
      const shortDry =
        item.orderDry && item.orderDry.dryId.type === "Short"
          ? item.orderDry.qty
          : "";
      const extraDry =
        item.orderDry && item.orderDry.dryId.type === "Extra"
          ? item.orderDry.qty
          : "";
      const rDry =
        item.orderDry && item.orderDry.dryId.type === "Regular+Extra"
          ? item.orderDry.qty
          : "";
      const sDry =
        item.orderDry && item.orderDry.dryId.type === "Short+Extra"
          ? item.orderDry.qty
          : "";

      const lightWash =
        item.orderWash && item.orderWash.washId.type === "Light"
          ? item.orderWash.qty
          : "";
      const mediumWash =
        item.orderWash && item.orderWash.washId.type === "Medium"
          ? item.orderWash.qty
          : "";
      const heavyWash =
        item.orderWash && item.orderWash.washId.type === "Heavy"
          ? item.orderWash.qty
          : "";
      const sWash =
        item.orderWash && item.orderWash.washId.type === "Spin"
          ? item.orderWash.qty
          : "";
      const rsWash =
        item.orderWash && item.orderWash.washId.type === "Rinse+Spin"
          ? item.orderWash.qty
          : "";

      return [
        `${item.customerId.firstName} ${item.customerId.lastName}`,
        item.jobOrderNumber,
        `${item.jobOrderNumber.slice(-1) === "Y" ? "DIY" : "DO"}`,
        lightWash,
        mediumWash,
        heavyWash,
        sWash,
        rsWash,
        regularDry,
        shortDry,
        extraDry,
        rDry,
        sDry,
        getLaundry[0].price,
        item.amountDue,
        discount,
        item.amountDue,
      ];
    });

    // add new rows and return them as array of row objects
    workSheet.addRows(newMappedData);

    let counter = 3;
    newMappedData.forEach(() => {
      counter++;
      workSheet.getCell(`A${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`B${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`C${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`D${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`E${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`F${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`G${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`H${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`I${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`J${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`K${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`L${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`M${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`N${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`O${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`P${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
      workSheet.getCell(`Q${counter}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
    });

    workBook.xlsx
      .writeFile(`public/uploads/${filename}`)
      .then(() => {
        res.json({ fileName: filename, data: newMappedData });
      })
      .catch(({ message: errMessage }) => {
        const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
        res.status(500).json(message);
      });
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

// @route   POST api/user/add
// @desc    Add A User
// @access  Private
router.post("/change-password", async (req, res) => {
  const { id, currentPassword, newPassword } = req.body;
  if ((id, currentPassword, newPassword)) {
    try {
      const getUser = await User.find({
        _id: id,
        password: currentPassword,
        deletedAt: {
          $exists: false,
        },
      });
      if (getUser.length > 0) {
        const updateUser = await User.findByIdAndUpdate(
          id,
          {
            $set: {
              password: newPassword,
            },
            updatedAt: Date.now(),
          },
          { new: true }
        );
        res.json(updateUser);
      } else {
        throw new Error("Current password is wrong");
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
