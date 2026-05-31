import express from "express";
import { protectRoute } from "../middleware/auth-middleware.js";
import validate from "../middleware/validation-middleware.js";
import { sendMessageSchema, respondProposalSchema, searchMessagesSchema } from "../validators/message-validator.js";
import {
  sendMessage,
  getConversation,
  getUnreadCount,
  generateIcebreakers,
  respondToDateProposal,
  generateSmartReplies,
  searchMessages,
} from "../controllers/message-controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/send", validate(sendMessageSchema), sendMessage);
router.get("/conversation/:userId", getConversation);
router.get("/unread-count", getUnreadCount);
router.post("/icebreakers/:userId", generateIcebreakers);
router.post("/date/respond", validate(respondProposalSchema), respondToDateProposal);
router.post("/smart-replies/:userId", generateSmartReplies);
router.get("/search/:userId", validate(searchMessagesSchema, "query"), searchMessages);

export default router;
