const mongoose = require("mongoose");
const Laundry = require("./models/laundry");
const Inventory = require("./models/inventory");
const User = require("./models/user");
const Staff = require("./models/staff");
const keys = require("./config/keys");

const mongoDbFunction = async () => {
  try {
    mongoose.connect(keys.mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log("mongodb connected");
  } catch (error) {
    console.log(`Cant connect to db due to ${error}`);
    process.exit(-1);
  }

  const user = await User.find({});
  const staff = await Staff.find({});
  const laundry = await Laundry.find({});
  const zonrox = await Inventory.find({ type: "Bleach", name: "Zonrox" });
  const fabcon = await Inventory.find({ type: "FabCon", name: "Surf" });
  const detergent = await Inventory.find({ type: "Detergent", name: "Ariel" });
  const plasticBag = await Inventory.find({
    type: "Plastic",
    name: "Plastic Bag",
  });

  if (!laundry || laundry.length === 0) {
    const insert = await Laundry.create({
      type: "Drop Off Fee",
      price: 5,
    });
    console.log("Response laundry: ", insert);
  }
  if (!zonrox || zonrox.length === 0) {
    const insert = await Inventory.create({
      type: "Bleach",
      name: "Zonrox",
      unitCost: 25,
      stockCode: "AAA",
      stock: 20,
    });
    console.log("Response zonrox: ", insert);
  }
  if (!plasticBag || plasticBag.length === 0) {
    const insert = await Inventory.create({
      type: "Plastic",
      name: "Plastic Bag",
      unitCost: 25,
      stockCode: "AAD",
      stock: 20,
    });
    console.log("Response plastic bag: ", insert);
  }
  if (!fabcon || fabcon.length === 0) {
    const insert = await Inventory.create({
      type: "FabCon",
      name: "Surf",
      unitCost: 10,
      stockCode: "AAB",
      stock: 20,
    });
    console.log("Response fabcon: ", insert);
  }
  if (!detergent || detergent.length === 0) {
    const insert = await Inventory.create({
      type: "Detergent",
      name: "Ariel",
      unitCost: 15,
      stockCode: "AAC",
      stock: 20,
    });
    console.log("Response detergent: ", insert);
  }

  if (!user || user.length === 0) {
    const insert = await User.create({
      username: "admin",
      password: "franklin",
      userType: "Admin",
    });
    console.log("Response admin: ", insert);
  }

  if (!staff || staff.length === 0) {
    const insert = await User.create({
      username: "johndoe",
      password: "john123",
      userType: "Staff",
    });
    const insert2 = await Staff.create({
      userId: insert._id,
      name: "John Doe",
    });
    console.log("Response staff: ", insert);
    console.log("Response staff: ", insert2);
  }
};

// before running this script, be advised that all of the existing data will be deleted
mongoDbFunction();
