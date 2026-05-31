import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { GENDERS, GENDER_PREFERENCES } from "../constants/genders.js";
import { SWIPE_ACTIONS } from "../constants/swipe-actions.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: Object.values(GENDERS),
    },
    genderPreference: {
      type: String,
      required: true,
      enum: Object.values(GENDER_PREFERENCES),
    },
    bio: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    interests: {
      type: [String],
      default: [],
    },
    swipeHistory: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        action: {
          type: String,
          enum: Object.values(SWIPE_ACTIONS),
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    superLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isGold: {
      type: Boolean,
      default: false,
    },
    incognitoMode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
