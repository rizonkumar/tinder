import express from "express";
import { protectRoute } from "../middleware/auth-middleware.js";
import validate from "../middleware/validation-middleware.js";
import { updateProfileSchema, enhanceProfileSchema } from "../validators/user-validator.js";
import {
  updateProfile,
  toggleIncognito,
  toggleGold,
  getStats,
  enhanceProfile,
} from "../controllers/user-controller.js";

const router = express.Router();

router.put("/update", protectRoute, validate(updateProfileSchema), updateProfile);
router.put("/toggle-incognito", protectRoute, toggleIncognito);
router.put("/toggle-gold", protectRoute, toggleGold);
router.get("/stats", protectRoute, getStats);
router.post("/enhance-bio", protectRoute, validate(enhanceProfileSchema), enhanceProfile);

export default router;
