const express = require("express");
const { protectRoute } = require("../middleware/auth-middleware");
const validate = require("../middleware/validation-middleware");
const { updateProfileSchema } = require("../validators/user-validator");
const {
  updateProfile,
  toggleIncognito,
  toggleGold,
  getStats,
} = require("../controllers/user-controller");

const router = express.Router();

router.put("/update", protectRoute, validate(updateProfileSchema), updateProfile);
router.put("/toggle-incognito", protectRoute, toggleIncognito);
router.put("/toggle-gold", protectRoute, toggleGold);
router.get("/stats", protectRoute, getStats);

module.exports = router;
