const express = require("express");
const { ensureAuth } = require("../middleware/auth");
const router = express.Router();
const Story = require("../models/Story");

// @route -> GET /stories/add
// @desc  -> Login/landing page

router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @route -> GET /stories/id
// @desc  -> show single story

router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      return res.render("errors/404");
    }

    res.render("stories/show", { story });
  } catch (err) {
    console.error(err.message);
    res.render("errors/404");
  }
});

// @route -> GET /stories/user/user-id
// @desc  -> get users stories

router.get("/user/:user_id", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.user_id,
      status: public,
    })
      .populate("user")
      .lean();

    res.render("stories/index", { stories });
  } catch (err) {
    console.log(err.message);
    res.render("errors/500");
  }
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

// @route -> GET /stories
// @desc  -> get all public stories

router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", { stories });
  } catch (err) {
    console.log(err.message);
    res.render("errors/500");
  }
});

// @route -> GET /stories/edit/:id
// @desc  -> show edit page

router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();

    if (!story) {
      return res.render("errors/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", { story });
    }
  } catch (err) {
    console.log(err.message);
    res.render("errors/500");
  }
});

// @route -> PUT /stories/:id
// @desc  -> edit or update stories

router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("errors/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err.message);
    res.render("errors/500");
  }
});

// @route -> DELETE /stories/id
// @desc  -> delete story

router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err.message);
    return res.render("errors/500");
  }
});

module.exports = router;
