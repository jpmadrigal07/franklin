const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Staff = require("../models/staff");
const keys = require("../config/keys");
const { UNKNOW_ERROR_OCCURED } = require("../constants");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("No user with that username");
    }
    const isValid = (await password) === user.password;
    if (!isValid) {
      throw new Error("Incorrect password");
    }
    // return jwt
    const token = jwt.sign(
      { id: user.id, username: user.username, userType: user.userType },
      keys.cookieKey,
      { expiresIn: "1d" }
    );
    const staff = await Staff.findOne({ userId: user.id });
    res.json({
      token,
      user,
      name: staff ? staff.name : "",
    });
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    res.status(500).json(message);
  }
});

router.post("/verify", async (req, res) => {
  const token = req.body.token;
  try {
    // Check if token is defined
    if (!token) {
      throw new Error("Token is invalid");
    }
    // Verify the token
    const { username, exp } = jwt.verify(token, keys.cookieKey);
    // Check if username exist in db
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("No user with that username");
    }
    // Check if token is not expired
    const elapsedTimeInSeconds = Math.floor(parseInt(exp) - Date.now() / 1000);
    const elapsedSeconds = elapsedTimeInSeconds % 60;
    if (Math.sign(elapsedSeconds) === -1) {
      throw new Error("Token is expired");
    }
    // Return isVerified true if all 3 condition passed
    res.json("User authentication is verified");
  } catch ({ message: errMessage }) {
    const message = errMessage ? errMessage : UNKNOW_ERROR_OCCURED;
    if (message === "jwt malformed") {
      res.status(500).json("Token is invalid");
    } else {
      res.status(500).json(message);
    }
  }
});

module.exports = router;
