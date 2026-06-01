import asyncHandler from "../utils/asyncHandler.js";
import datePlanService from "../services/date-plan-service.js";
import sendResponse from "../utils/responseHandler.js";

export const getActiveDatePlan = asyncHandler(async (req, res) => {
  const { matchUserId } = req.params;
  const plan = await datePlanService.getActiveDatePlan(req.user._id, matchUserId);
  sendResponse(res, 200, plan, "Active date plan retrieved successfully");
});

export const voteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  const plan = await datePlanService.voteCategory(id, req.user._id, category);
  sendResponse(res, 200, plan, "Category vote updated successfully");
});

export const proposeVenue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, location } = req.body;
  const plan = await datePlanService.proposeVenue(id, req.user._id, title, location);
  sendResponse(res, 200, plan, "Venue proposal added successfully");
});

export const voteVenue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { venueId } = req.body;
  const plan = await datePlanService.voteVenue(id, req.user._id, venueId);
  sendResponse(res, 200, plan, "Venue vote updated successfully");
});

export const proposeDateTime = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;
  const plan = await datePlanService.proposeDateTime(id, req.user._id, date, time);
  sendResponse(res, 200, plan, "Date-time proposal added successfully");
});

export const voteDateTime = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { dateTimeId } = req.body;
  const plan = await datePlanService.voteDateTime(id, req.user._id, dateTimeId);
  sendResponse(res, 200, plan, "Date-time vote updated successfully");
});

export const finalizeDatePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { venueId, dateTimeId } = req.body;
  const plan = await datePlanService.finalizeDatePlan(id, req.user._id, venueId, dateTimeId);
  sendResponse(res, 200, plan, "Date plan finalized successfully");
});

export const getUpcomingDates = asyncHandler(async (req, res) => {
  const dates = await datePlanService.getUpcomingDates(req.user._id);
  sendResponse(res, 200, dates, "Upcoming dates retrieved successfully");
});
