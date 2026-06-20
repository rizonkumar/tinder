import express from "express";
import { protectRoute } from "../middleware/auth-middleware.js";
import validate from "../middleware/validation-middleware.js";
import {
  sendMessageSchema,
  respondProposalSchema,
  searchMessagesSchema,
  editMessageSchema,
  deleteMessageSchema,
  reactionSchema,
  togglePinSchema,
  linkPreviewSchema,
  respondGameSchema,
} from "../validators/message-validator.js";
import {
  sendMessage,
  getConversation,
  getUnreadCount,
  generateIcebreakers,
  respondToDateProposal,
  getConfirmedDates,
  generateSmartReplies,
  searchMessages,
  editMessage,
  deleteMessage,
  clearConversation,
  toggleReaction,
  togglePin,
  getLinkPreview,
  markConversationAsRead,
  respondToGameProposal,
} from "../controllers/message-controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/send", validate(sendMessageSchema), sendMessage);
router.get("/conversation/:userId", getConversation);
router.get("/unread-count", getUnreadCount);
router.get("/link-preview", validate(linkPreviewSchema, "query"), getLinkPreview);
router.post("/icebreakers/:userId", generateIcebreakers);
router.post("/date/respond", validate(respondProposalSchema), respondToDateProposal);
router.get("/dates/confirmed", getConfirmedDates);
router.post("/game/respond", validate(respondGameSchema), respondToGameProposal);
router.post("/smart-replies/:userId", generateSmartReplies);
router.get("/search/:userId", validate(searchMessagesSchema, "query"), searchMessages);
router.patch("/:messageId", validate(editMessageSchema), editMessage);
router.delete("/:messageId", validate(deleteMessageSchema), deleteMessage);
router.delete("/conversation/:userId", clearConversation);
router.post("/react/:messageId", validate(reactionSchema), toggleReaction);
router.patch("/:messageId/pin", validate(togglePinSchema), togglePin);
router.post("/read/:userId", markConversationAsRead);

export default router;
