const express = require("express");
const { protectRoute } = require("../middleware/auth-middleware");

const router = express.Router();

router.use(protectRoute);

router.post("/send", sendMessage);
router.get("/conversation/:userID", getConversation);

module.exports = router;
