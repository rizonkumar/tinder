const User = require("../models/user-model");

class UserRepository {
  async findById(id, selectFields = "", populateOptions = []) {
    let query = User.findById(id);
    if (selectFields) {
      query = query.select(selectFields);
    }
    if (populateOptions.length > 0) {
      populateOptions.forEach((option) => {
        query = query.populate(option);
      });
    }
    return await query;
  }

  async findByEmail(email, selectFields = "") {
    let query = User.findOne({ email });
    if (selectFields) {
      query = query.select(selectFields);
    }
    return await query;
  }

  async create(userData) {
    return await User.create(userData);
  }

  async findByIdAndUpdate(id, updateData, options = { new: true, runValidators: true }) {
    return await User.findByIdAndUpdate(id, updateData, options);
  }

  async find(filter = {}, selectFields = "", limit = 0, populateOptions = []) {
    let query = User.find(filter);
    if (selectFields) {
      query = query.select(selectFields);
    }
    if (limit > 0) {
      query = query.limit(limit);
    }
    if (populateOptions.length > 0) {
      populateOptions.forEach((option) => {
        query = query.populate(option);
      });
    }
    return await query;
  }

  async countDocuments(filter = {}) {
    return await User.countDocuments(filter);
  }

  async save(userDocument) {
    return await userDocument.save();
  }
}

module.exports = new UserRepository();
