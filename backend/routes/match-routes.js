const express = require("express");
const rateLimit = require("express-rate-limit");

const { protectRoute } = require("../middleware/auth-middleware");
const validate = require("../middleware/validation-middleware");
const { swipeParamsSchema, exploreQuerySchema } = require("../validators/match-validator");
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
  message: "Too many swipes, please try again later",
});

router.post(
  "/swipe-right/:likedUserId",
  protectRoute,
  swipeLimiter,
  validate(swipeParamsSchema, "params"),
  swipeRight
);
router.post(
  "/swipe-left/:dislikedUserId",
  protectRoute,
  swipeLimiter,
  validate(swipeParamsSchema, "params"),
  swipeLeft
);
router.post(
  "/swipe-super/:likedUserId",
  protectRoute,
  swipeLimiter,
  validate(swipeParamsSchema, "params"),
  superLike
);

router.get("/liked", protectRoute, getLikedUsers);
router.get("/who-liked-me", protectRoute, getWhoLikedMe);
router.get("/", protectRoute, getMatches);
router.get("/user-profiles", protectRoute, getUserProfiles);
router.get("/explore", protectRoute, validate(exploreQuerySchema, "query"), getExploreProfiles);
router.post("/rewind", protectRoute, rewind);

module.exports = router;
