const express = require("express");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const router = express.Router();

// @route -> GET /
// @desc  -> Login/landing page

router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// @route -> GET /dashboard
// @desc  -> get the user dashboard

router.get("/dashboard", ensureAuth, (req, res) => {
  res.render("dashboard", {
    name: req.user.firstName,
  });
});

module.exports = router;
