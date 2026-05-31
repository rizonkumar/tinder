import express from "express";
import rateLimit from "express-rate-limit";
import { protectRoute } from "../middleware/auth-middleware.js";
import validate from "../middleware/validation-middleware.js";
import { swipeParamsSchema, exploreQuerySchema } from "../validators/match-validator.js";
import {
  swipeRight,
  swipeLeft,
  superLike,
  getMatches,
  getUserProfiles,
  getExploreProfiles,
  rewind,
  getLikedUsers,
  getWhoLikedMe,
} from "../controllers/match-controller.js";

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

export default router;
