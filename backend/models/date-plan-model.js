import mongoose from "mongoose";

const datePlanSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryVotes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        category: {
          type: String,
          required: true,
          enum: ["Coffee", "Dinner", "Drinks", "Outdoor"],
        },
      },
    ],
    venueProposals: [
      {
        id: {
          type: String,
          required: true,
        },
        proposedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        location: {
          type: String,
          required: true,
        },
        votes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
    dateTimeProposals: [
      {
        id: {
          type: String,
          required: true,
        },
        proposedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        time: {
          type: String,
          required: true,
        },
        votes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
    finalVenue: {
      title: String,
      location: String,
    },
    finalDateTime: {
      date: String,
      time: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["planning", "finalized", "cancelled"],
      default: "planning",
    },
  },
  { timestamps: true }
);

datePlanSchema.index({ userA: 1, userB: 1 });

const DatePlan = mongoose.model("DatePlan", datePlanSchema);

export default DatePlan;
