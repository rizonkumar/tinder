const express = require("express");
const rateLimit = require("express-rate-limit");

const { protectRoute } = require("../middleware/auth-middleware");
const {
  swipeRight,
  swipeLeft,
  getMatches,
  getUserProfiles,
} = require("../controllers/match-controller");

const router = express.Router();

const swipeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 swipes per windowMs
});

router.post(
  "/swipe-right/:likedUserId",
  protectRoute,
  swipeLimiter,
  swipeRight
);
router.post(
  "/swipe-left/:dislikedUserId",
  swipeLimiter,
  protectRoute,
  swipeLeft
);

router.get("/", protectRoute, getMatches);
router.get("/user-profiles", protectRoute, getUserProfiles);

module.exports = router;
