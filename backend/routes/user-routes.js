const express = require("express");
const { protectRoute } = require("../middleware/auth-middleware");
const { updateProfile } = require("../controllers/user-controller");

const router = express.Router();

router.put("/update", protectRoute, updateProfile);

module.exports = router;
