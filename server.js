const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("cookie-session");
const keys = require("./config/keys");
const AuthRoute = require("./routes/auth");
const UserRoute = require("./routes/user");
const StaffRoute = require("./routes/staff");
const CustomerRoute = require("./routes/customer");
const InventoryRoute = require("./routes/inventory");
const WashRoute = require("./routes/wash");
const AddOnRoute = require("./routes/addOn");
const LaundryRoute = require("./routes/laundry");
const DryRoute = require("./routes/dry");
const DiscountRoute = require("./routes/discount");
const FolderRoute = require("./routes/folder");
require("./seed");

const path = require("path");
const app = express();

// Connect to Mongo
mongoose
  .connect(keys.mongoURI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }) // Adding new mongo url parser
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use("/public", express.static("public"));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

// REST API
app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/staffs", StaffRoute);
app.use("/api/customers", CustomerRoute);
app.use("/api/inventory", InventoryRoute);
app.use("/api/laundry", LaundryRoute);
app.use("/api/addOn", AddOnRoute);
app.use("/api/dry", DryRoute);
app.use("/api/discount", DiscountRoute);
app.use("/api/wash", WashRoute);
app.use("/api/folder", FolderRoute);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(`REST API: /api/**`);
});
