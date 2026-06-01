import express from "express";
import { protectRoute } from "../middleware/auth-middleware.js";
import validate from "../middleware/validation-middleware.js";
import {
  voteCategorySchema,
  proposeVenueSchema,
  voteVenueSchema,
  proposeDateTimeSchema,
  voteDateTimeSchema,
  finalizeDateSchema,
} from "../validators/date-plan-validator.js";
import {
  getActiveDatePlan,
  voteCategory,
  proposeVenue,
  voteVenue,
  proposeDateTime,
  voteDateTime,
  finalizeDatePlan,
  getUpcomingDates,
} from "../controllers/date-plan-controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/match/:matchUserId", getActiveDatePlan);
router.post("/:id/vote-category", validate(voteCategorySchema), voteCategory);
router.post("/:id/propose-venue", validate(proposeVenueSchema), proposeVenue);
router.post("/:id/vote-venue", validate(voteVenueSchema), voteVenue);
router.post("/:id/propose-datetime", validate(proposeDateTimeSchema), proposeDateTime);
router.post("/:id/vote-datetime", validate(voteDateTimeSchema), voteDateTime);
router.post("/:id/finalize", validate(finalizeDateSchema), finalizeDatePlan);
router.get("/upcoming", getUpcomingDates);

export default router;
