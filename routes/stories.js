const express = require("express");
const { ensureAuth } = require("../middleware/auth");
const router = express.Router();
const Story = require("../models/Story");

// @route -> GET /stories/add
// @desc  -> Login/landing page

router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @route -> POST /stories
// @desc  -> load stories

router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;

    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err.message);
    res.render("errors/500");
  }
});

module.exports = router;
