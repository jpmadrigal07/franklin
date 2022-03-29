const mongoose = require("mongoose");
const Laundry = require("./models/laundry");
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

  const laundry = await Laundry.find({});

  if (!laundry || laundry.length === 0) {
    const insert = await Laundry.create({
      type: "Drop Off Fee",
      price: 5,
    });
    console.log("Response: ", insert);
  }
};

// before running this script, be advised that all of the existing data will be deleted
mongoDbFunction();
