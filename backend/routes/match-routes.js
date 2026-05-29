const express = require("express");
const rateLimit = require("express-rate-limit");

const { protectRoute } = require("../middleware/auth-middleware");
const {
  swipeRight,
  swipeLeft,
  superLike,
  getMatches,
  getUserProfiles,
  getExploreProfiles,
  rewind,
  getLikedUsers,
  getWhoLikedMe,
} = require("../controllers/match-controller");

const router = express.Router();

const swipeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.post(
  "/swipe-right/:likedUserId",
  protectRoute,
  swipeLimiter,
  swipeRight,
);
router.post(
  "/swipe-left/:dislikedUserId",
  swipeLimiter,
  protectRoute,
  swipeLeft,
);
router.post(
  "/swipe-super/:likedUserId",
  swipeLimiter,
  protectRoute,
  superLike,
);

router.get("/liked", protectRoute, getLikedUsers);
router.get("/who-liked-me", protectRoute, getWhoLikedMe);
router.get("/", protectRoute, getMatches);
router.get("/user-profiles", protectRoute, getUserProfiles);
router.get("/explore", protectRoute, getExploreProfiles);
router.post("/rewind", protectRoute, rewind);

module.exports = router;
