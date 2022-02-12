const express = require("express");
const router = express.Router();
const passport = require("passport");
const _ = require("lodash");
const keys = require("../config/keys");
const Student = require("../models/student");
const jwt = require('jsonwebtoken');

router.get("/auth/local/callback", (req, res) => {
  res.send(req.user);
});

router.get("/auth/local/failure", (req, res) => {
  res.send(false);
});

router.post(
  "/auth/local",
  passport.authenticate("local-login", {
    successRedirect: "/auth/local/callback",
    failureRedirect: "/auth/local/failure",
  })
);

router.post("/auth/local/verify", (req, res) => {
  const token = req.body.token;
  if(token) {
    const tokenInfo = jwt.verify(token, keys.sessionKey);
    if(tokenInfo) {
      Student.findOne({userId: tokenInfo.userId}).then(student => {
        const tokenizedUser = {
          _id: tokenInfo.userId,
          email: tokenInfo.email,
          userType: tokenInfo.userType
        }
        res.json({
          res: { user: tokenizedUser, otherInfo: student },
          isSuccess: true
        });
      });
    } else {
      res.json({
        res: "There is a problem verifying the token",
        isSuccess: false
      });
    }
  } else {
    res.json({
      res: "There is a problem on the token",
      isSuccess: false
    });
  }
});

router.get("/api/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
