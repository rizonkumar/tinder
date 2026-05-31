const mongoose = require("mongoose");
const config = require("./env");

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error Connecting to MongoDB", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
