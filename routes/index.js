const express = require("express");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const router = express.Router();
const Story = require("../models/Story");

// @route -> GET /
// @desc  -> Login/landing page

router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// @route -> GET /dashboard
// @desc  -> get the user dashboard

router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      stories,
    });
  } catch (err) {
    console.log(err.message);
    res.render("errors/404");
  }
});

module.exports = router;
