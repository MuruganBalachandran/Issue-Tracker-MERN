// region imports
import mongoose from "mongoose";
// endregion

// region create schema
const userSchema = new mongoose.Schema(
  {
    User_Id: {
      type: mongoose.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    Name: String,

    Email: {
      type: String,
    },

    Password: {
      type: String,
    },

    Role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    Email_Verified: {
      type: Number,
      default: 0,
    },
    Is_Deleted: {
      type: Number,
      default: 0,
    },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
// region exports
export default User;
// endregion
