import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    Issue_Id: {
      type: mongoose.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    Title: String,
    Description: String,

    Status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },

    Priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    Reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    Is_Deleted: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Issue", issueSchema);
