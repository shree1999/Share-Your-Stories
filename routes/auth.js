const express = require("express");
const passport = require("passport");
const router = express.Router();

// @route -> GET /auth/google
// @desc  -> auth with google

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @route -> GET /auth/google/callback
// @desc  -> callback from google

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @route -> GET /auth/logout
// @desc  -> logout user
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
