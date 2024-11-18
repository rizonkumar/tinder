const express = require("express");
const { protectRoute } = require("../middleware/auth-middleware");
const {
  swipeRight,
  swipeLeft,
  getMatches,
  getUserProfiles,
} = require("../controllers/match-controller");

const router = express.Router();

router.post("/swipe-right/:likedUserId", protectRoute, swipeRight);
router.post("/swipe-left/:dislikedUserId", protectRoute, swipeLeft);

router.get("/", protectRoute, getMatches);
router.get("/user-profiles", protectRoute, getUserProfiles);

module.exports = router;
