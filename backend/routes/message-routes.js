const express = require("express");
const { protectRoute } = require("../middleware/auth-middleware");
const {
  sendMessage,
  getConversation,
  getUnreadCount,
} = require("../controllers/message-controller");

const router = express.Router();

router.use(protectRoute);

router.post("/send", sendMessage);
router.get("/conversation/:userId", getConversation);
router.get("/unread-count", getUnreadCount);

module.exports = router;
