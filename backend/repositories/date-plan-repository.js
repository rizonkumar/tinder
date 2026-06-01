import DatePlan from "../models/date-plan-model.js";

class DatePlanRepository {
  async findById(id, populateOptions = []) {
    let query = DatePlan.findById(id);
    if (populateOptions.length > 0) {
      query = query.populate(populateOptions);
    }
    return await query;
  }

  async findActive(userIdA, userIdB, populateOptions = []) {
    let query = DatePlan.findOne({
      $or: [
        { userA: userIdA, userB: userIdB },
        { userA: userIdB, userB: userIdA },
      ],
      status: "planning",
    });

    if (populateOptions.length > 0) {
      query = query.populate(populateOptions);
    }
    return await query;
  }

  async findUpcoming(userId, populateOptions = []) {
    let query = DatePlan.find({
      $or: [{ userA: userId }, { userB: userId }],
      status: "finalized",
    }).sort({ updatedAt: -1 });

    if (populateOptions.length > 0) {
      query = query.populate(populateOptions);
    }
    return await query;
  }

  async create(data) {
    return await DatePlan.create(data);
  }

  async populate(document, populateOptions = []) {
    if (populateOptions.length > 0) {
      return await document.populate(populateOptions);
    }
    return document;
  }

  async save(document) {
    return await document.save();
  }
}

export default new DatePlanRepository();
