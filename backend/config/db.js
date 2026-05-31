import mongoose from "mongoose";
import config from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error Connecting to MongoDB", err.message);
    process.exit(1);
  }
};

export default connectDB;
