const express = require("express");
const { protectRoute } = require("../middleware/auth-middleware");
const {
  sendMessage,
  getConversation,
  getUnreadCount,
  generateIcebreakers,
  respondToDateProposal,
  generateSmartReplies,
  searchMessages,
} = require("../controllers/message-controller");

const router = express.Router();

router.use(protectRoute);

router.post("/send", sendMessage);
router.get("/conversation/:userId", getConversation);
router.get("/unread-count", getUnreadCount);
router.post("/icebreakers/:userId", generateIcebreakers);
router.post("/date/respond", respondToDateProposal);
router.post("/smart-replies/:userId", generateSmartReplies);
router.get("/search/:userId", searchMessages);

module.exports = router;
