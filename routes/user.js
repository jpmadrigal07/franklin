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
  const { from, to } = req.body;

  const filename = `Report-${moment(from).format("MMDDYY")}-${moment(to).format(
    "MMDDYY"
  )}.xlsx`;

  const ordersCondition = {
    createdAt: {
      $gte: new Date(moment(from).startOf("day")),
      $lt: new Date(moment(to).endOf("day")),
    },
    deletedAt: { $exists: false },
    orderStatus: "Closed",
  };

  const workBook = new Excel.Workbook();
  const workSheet = workBook.addWorksheet("Reports");

  const row1 = workSheet.getRow(1);
  const row2 = workSheet.getRow(2);
  const row3 = workSheet.getRow(3);
  const customerCol = workSheet.getColumn(1);
  const dateCol = workSheet.getColumn(2);

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

  workSheet.getCell("O1").border = {
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

  workSheet.getCell("E2").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  workSheet.getCell("J2").border = {
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

  workSheet.getCell("R2").border = {
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

  workSheet.getCell("N3").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  row1.getCell("A").value = "CUSTOMER";
  row1.getCell("B").value = "JOB ORDER";
  row1.getCell("O").value = "PAYMENT";

  workSheet.mergeCells("B1:N1");
  workSheet.mergeCells("O1:R1");

  workSheet.mergeCells("A2:A3");
  workSheet.mergeCells("B2:B3");
  workSheet.mergeCells("C2:C3");
  workSheet.mergeCells("D2:D3");

  row2.getCell("A").value = "CUSTOMER NAME";
  row2.getCell("B").value = "DATE";
  row2.getCell("C").value = "JO NUM";
  row2.getCell("D").value = "DIY/DO";
  row2.getCell("E").value = "WASH";
  row2.getCell("J").value = "DRY";
  row2.getCell("O").value = "DO FEE";
  row2.getCell("P").value = "AMT";
  row2.getCell("Q").value = "DISC";
  row2.getCell("R").value = "TOTAL";

  workSheet.mergeCells("E2:I2");
  workSheet.mergeCells("J2:N2");

  workSheet.mergeCells("O2:O3");
  workSheet.mergeCells("P2:P3");
  workSheet.mergeCells("Q2:Q3");
  workSheet.mergeCells("R2:R3");

  row3.getCell("E").value = "L";
  row3.getCell("F").value = "M";
  row3.getCell("G").value = "H";
  row3.getCell("H").value = "SP";
  row3.getCell("I").value = "RSP";
  row3.getCell("J").value = "R";
  row3.getCell("K").value = "S";
  row3.getCell("L").value = "E";
  row3.getCell("M").value = "R+";
  row3.getCell("N").value = "S+";

  row1.getCell("A").alignment = { horizontal: "center" };
  row1.getCell("B").alignment = { horizontal: "center" };
  row1.getCell("O").alignment = { horizontal: "center" };

  customerCol.width = 26;
  dateCol.width = 13;

  row2.getCell("A").alignment = { horizontal: "center" };
  row2.getCell("B").alignment = { horizontal: "center" };
  row2.getCell("C").alignment = { horizontal: "center" };
  row2.getCell("D").alignment = { horizontal: "center" };
  row2.getCell("E").alignment = { horizontal: "center" };
  row2.getCell("J").alignment = { horizontal: "center" };

  row2.getCell("O").alignment = { horizontal: "center" };
  row2.getCell("P").alignment = { horizontal: "center" };
  row2.getCell("Q").alignment = { horizontal: "center" };
  row2.getCell("R").alignment = { horizontal: "center" };

  row3.getCell("E").alignment = { horizontal: "center" };
  row3.getCell("F").alignment = { horizontal: "center" };
  row3.getCell("G").alignment = { horizontal: "center" };
  row3.getCell("H").alignment = { horizontal: "center" };
  row3.getCell("I").alignment = { horizontal: "center" };
  row3.getCell("J").alignment = { horizontal: "center" };
  row3.getCell("K").alignment = { horizontal: "center" };
  row3.getCell("L").alignment = { horizontal: "center" };
  row3.getCell("M").alignment = { horizontal: "center" };
  row3.getCell("N").alignment = { horizontal: "center" };

  workSheet.getCell("A1").font = {
    bold: true,
  };

  workSheet.getCell("B1").font = {
    bold: true,
  };

  workSheet.getCell("O1").font = {
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

  workSheet.getCell("E2").font = {
    bold: true,
  };

  workSheet.getCell("J2").font = {
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

  workSheet.getCell("R2").font = {
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

  workSheet.getCell("N3").font = {
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
        return b?.total ? a + b?.total : 0;
      }, 0);

      const regularDry =
        item.orderDry?.dryId && item.orderDry?.dryId.type === "Regular"
          ? item.orderDry.machineNumber
          : "";
      const shortDry =
        item.orderDry?.dryId && item.orderDry?.dryId.type === "Short"
          ? item.orderDry.machineNumber
          : "";
      const extraDry =
        item.orderDry?.dryId && item.orderDry?.dryId.type === "Extra"
          ? item.orderDry.machineNumber
          : "";
      const rDry =
        item.orderDry?.dryId && item.orderDry?.dryId.type === "Regular+Extra"
          ? item.orderDry.machineNumber
          : "";
      const sDry =
        item.orderDry?.dryId && item.orderDry?.dryId.type === "Short+Extra"
          ? item.orderDry.machineNumber
          : "";

      const lightWash =
        item.orderWash?.washId && item.orderWash?.washId.type === "Light"
          ? item.orderWash.machineNumber
          : "";
      const mediumWash =
        item.orderWash?.washId && item.orderWash?.washId.type === "Medium"
          ? item.orderWash.machineNumber
          : "";
      const heavyWash =
        item.orderWash?.washId && item.orderWash?.washId.type === "Heavy"
          ? item.orderWash.machineNumber
          : "";
      const sWash =
        item.orderWash?.washId && item.orderWash?.washId.type === "Spin"
          ? item.orderWash.machineNumber
          : "";
      const rsWash =
        item.orderWash?.washId && item.orderWash?.washId.type === "Rinse+Spin"
          ? item.orderWash.machineNumber
          : "";

      const doFee =
        item.jobOrderNumber.slice(-1) === "F" && item.laundryId
          ? getLaundry[0].price
            ? getLaundry[0].price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : "0"
          : "0";

      const amount = item.amountDue
        ? item.amountDue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : "0";

      const discountFinal = discount
        ? discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : "0";

      const finalAmount =
        parseFloat(discountFinal) + parseFloat(amount) - parseFloat(doFee);

      return [
        `${item.customerId.firstName} ${item.customerId.lastName}`,
        moment(item.createdAt).format("MM/DD/YYYY"),
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
        doFee,
        finalAmount,
        discountFinal,
        item.amountDue
          ? item.amountDue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : "0",
      ];
    });

    // add new rows and return them as array of row objects

    const totalRow = newMappedData.reduce(
      function (a, b) {
        let accu = a;
        accu[4] = b[4] ? accu[4] + 1 : accu[4];
        accu[5] = b[5] ? accu[5] + 1 : accu[5];
        accu[6] = b[6] ? accu[6] + 1 : accu[6];
        accu[7] = b[7] ? accu[7] + 1 : accu[7];
        accu[8] = b[8] ? accu[8] + 1 : accu[8];
        accu[9] = b[9] ? accu[9] + 1 : accu[9];
        accu[10] = b[10] ? accu[10] + 1 : accu[10];
        accu[11] = b[11] ? accu[11] + 1 : accu[11];
        accu[12] = b[12] ? accu[12] + 1 : accu[12];
        accu[13] = b[13] ? accu[13] + 1 : accu[13];
        return accu;
      },
      ["", "", "", "", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "", "", "", ""]
    );

    const mappedDataWithTotal = [...newMappedData, totalRow];

    workSheet.addRows(mappedDataWithTotal);

    let counter = 3;
    mappedDataWithTotal.forEach(() => {
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
      workSheet.getCell(`R${counter}`).border = {
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
