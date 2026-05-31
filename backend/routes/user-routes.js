import express from "express";
import { protectRoute } from "../middleware/auth-middleware.js";
import validate from "../middleware/validation-middleware.js";
import { updateProfileSchema } from "../validators/user-validator.js";
import {
  updateProfile,
  toggleIncognito,
  toggleGold,
  getStats,
} from "../controllers/user-controller.js";

const router = express.Router();

router.put("/update", protectRoute, validate(updateProfileSchema), updateProfile);
router.put("/toggle-incognito", protectRoute, toggleIncognito);
router.put("/toggle-gold", protectRoute, toggleGold);
router.get("/stats", protectRoute, getStats);

export default router;
