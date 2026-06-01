import datePlanRepository from "../repositories/date-plan-repository.js";
import AppError from "../utils/appError.js";
import { io } from "../socket/socket.js";
import { SOCKET_EVENTS } from "../constants/socket-events.js";
import DatePlanDto from "../dtos/date-plan-dto.js";

class DatePlanService {
  async getActiveDatePlan(userId, matchUserId) {
    const sorted = [userId.toString(), matchUserId.toString()].sort();
    const userA = sorted[0];
    const userB = sorted[1];

    let plan = await datePlanRepository.findActive(userA, userB);
    if (!plan) {
      plan = await datePlanRepository.create({
        userA,
        userB,
        categoryVotes: [],
        venueProposals: [],
        dateTimeProposals: [],
        status: "planning",
      });
    }

    const populated = await datePlanRepository.populate(plan, [
      { path: "userA", select: "name image" },
      { path: "userB", select: "name image" },
    ]);

    return new DatePlanDto(populated);
  }

  async voteCategory(datePlanId, userId, category) {
    const plan = await datePlanRepository.findById(datePlanId);
    if (!plan) {
      throw new AppError("Date plan not found", 404);
    }
    if (plan.status !== "planning") {
      throw new AppError("This date plan is already finalized or cancelled", 400);
    }

    const existingIndex = plan.categoryVotes.findIndex(
      (v) => v.user.toString() === userId.toString()
    );

    if (existingIndex !== -1) {
      if (plan.categoryVotes[existingIndex].category === category) {
        plan.categoryVotes.splice(existingIndex, 1);
      } else {
        plan.categoryVotes[existingIndex].category = category;
      }
    } else {
      plan.categoryVotes.push({ user: userId, category });
    }

    await datePlanRepository.save(plan);

    const populated = await datePlanRepository.populate(plan, [
      { path: "userA", select: "name image" },
      { path: "userB", select: "name image" },
    ]);

    const dto = new DatePlanDto(populated);
    io.to(`dateplan_${datePlanId}`).emit(SOCKET_EVENTS.DATE_PLAN_UPDATED, { datePlan: dto });
    return dto;
  }

  async proposeVenue(datePlanId, userId, title, location) {
    const plan = await datePlanRepository.findById(datePlanId);
    if (!plan) {
      throw new AppError("Date plan not found", 404);
    }
    if (plan.status !== "planning") {
      throw new AppError("This date plan is already finalized or cancelled", 400);
    }

    const proposalId = Math.random().toString(36).substring(2, 11);
    plan.venueProposals.push({
      id: proposalId,
      proposedBy: userId,
      title,
      location,
      votes: [userId],
    });

    await datePlanRepository.save(plan);

    const populated = await datePlanRepository.populate(plan, [
      { path: "userA", select: "name image" },
      { path: "userB", select: "name image" },
    ]);

    const dto = new DatePlanDto(populated);
    io.to(`dateplan_${datePlanId}`).emit(SOCKET_EVENTS.DATE_PLAN_UPDATED, { datePlan: dto });
    return dto;
  }

  async voteVenue(datePlanId, userId, venueId) {
    const plan = await datePlanRepository.findById(datePlanId);
    if (!plan) {
      throw new AppError("Date plan not found", 404);
    }
    if (plan.status !== "planning") {
      throw new AppError("This date plan is already finalized or cancelled", 400);
    }

    const venue = plan.venueProposals.find((v) => v.id === venueId);
    if (!venue) {
      throw new AppError("Venue proposal not found", 404);
    }

    const voteIndex = venue.votes.findIndex((v) => v.toString() === userId.toString());
    if (voteIndex !== -1) {
      venue.votes.splice(voteIndex, 1);
    } else {
      venue.votes.push(userId);
    }

    await datePlanRepository.save(plan);

    const populated = await datePlanRepository.populate(plan, [
      { path: "userA", select: "name image" },
      { path: "userB", select: "name image" },
    ]);

    const dto = new DatePlanDto(populated);
    io.to(`dateplan_${datePlanId}`).emit(SOCKET_EVENTS.DATE_PLAN_UPDATED, { datePlan: dto });
    return dto;
  }

  async proposeDateTime(datePlanId, userId, date, time) {
    const plan = await datePlanRepository.findById(datePlanId);
    if (!plan) {
      throw new AppError("Date plan not found", 404);
    }
    if (plan.status !== "planning") {
      throw new AppError("This date plan is already finalized or cancelled", 400);
    }

    const proposalId = Math.random().toString(36).substring(2, 11);
    plan.dateTimeProposals.push({
      id: proposalId,
      proposedBy: userId,
      date,
      time,
      votes: [userId],
    });

    await datePlanRepository.save(plan);

    const populated = await datePlanRepository.populate(plan, [
      { path: "userA", select: "name image" },
      { path: "userB", select: "name image" },
    ]);

    const dto = new DatePlanDto(populated);
    io.to(`dateplan_${datePlanId}`).emit(SOCKET_EVENTS.DATE_PLAN_UPDATED, { datePlan: dto });
    return dto;
  }

  async voteDateTime(datePlanId, userId, dateTimeId) {
    const plan = await datePlanRepository.findById(datePlanId);
    if (!plan) {
      throw new AppError("Date plan not found", 404);
    }
    if (plan.status !== "planning") {
      throw new AppError("This date plan is already finalized or cancelled", 400);
    }

    const dateTime = plan.dateTimeProposals.find((t) => t.id === dateTimeId);
    if (!dateTime) {
      throw new AppError("Date-time proposal not found", 404);
    }

    const voteIndex = dateTime.votes.findIndex((v) => v.toString() === userId.toString());
    if (voteIndex !== -1) {
      dateTime.votes.splice(voteIndex, 1);
    } else {
      dateTime.votes.push(userId);
    }

    await datePlanRepository.save(plan);

    const populated = await datePlanRepository.populate(plan, [
      { path: "userA", select: "name image" },
      { path: "userB", select: "name image" },
    ]);

    const dto = new DatePlanDto(populated);
    io.to(`dateplan_${datePlanId}`).emit(SOCKET_EVENTS.DATE_PLAN_UPDATED, { datePlan: dto });
    return dto;
  }

  async finalizeDatePlan(datePlanId, userId, venueId, dateTimeId) {
    const plan = await datePlanRepository.findById(datePlanId);
    if (!plan) {
      throw new AppError("Date plan not found", 404);
    }
    if (plan.status !== "planning") {
      throw new AppError("This date plan is already finalized or cancelled", 400);
    }

    const venue = plan.venueProposals.find((v) => v.id === venueId);
    const dateTime = plan.dateTimeProposals.find((t) => t.id === dateTimeId);

    if (!venue || !dateTime) {
      throw new AppError("Selected proposals not found", 404);
    }

    if (venue.votes.length < 2 || dateTime.votes.length < 2) {
      throw new AppError("Both users must vote for the chosen venue and date-time to lock it in", 400);
    }

    plan.finalVenue = {
      title: venue.title,
      location: venue.location,
    };
    plan.finalDateTime = {
      date: dateTime.date,
      time: dateTime.time,
    };
    plan.status = "finalized";

    await datePlanRepository.save(plan);

    const populated = await datePlanRepository.populate(plan, [
      { path: "userA", select: "name image" },
      { path: "userB", select: "name image" },
    ]);

    const dto = new DatePlanDto(populated);
    io.to(`dateplan_${datePlanId}`).emit(SOCKET_EVENTS.DATE_PLAN_UPDATED, { datePlan: dto });
    return dto;
  }

  async getUpcomingDates(userId) {
    const dates = await datePlanRepository.findUpcoming(userId, [
      { path: "userA", select: "name image" },
      { path: "userB", select: "name image" },
    ]);

    return dates.map((d) => new DatePlanDto(d));
  }
}

export default new DatePlanService();
