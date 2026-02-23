// region imports
import mongoose from "mongoose";

import {env} from "./envConfig.js"
// endregion

// region connect db
export const connectDB = async () => {
  try {
    await mongoose.connect(env?.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("error connecting mongodb:", err);
    process.exit(1);
  }
};
// endregion

