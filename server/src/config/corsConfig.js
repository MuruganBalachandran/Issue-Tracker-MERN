// region imports
import cors from "cors";
import { env } from "../env/envConfig.js";
// endregion

// region cors middleware
export const corsConfig = cors({
  origin: (origin, callback) => {
    // allow Postman / server-to-server
    if (!origin) return callback(null, true);

    const allowedOrigins = [env.CLIENT_URL];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
});
// endregion
