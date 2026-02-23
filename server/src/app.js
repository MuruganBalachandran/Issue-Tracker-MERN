// region imports 
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";

// endregion

const app = express();

// region Middlewares

app.use(express.json());

// logger
app.use(morgan("dev"));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser()); 

// region Health check
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

// region Routes
app.use("/api/users", authRoutes);
app.use("/api/issues", issueRoutes);

// region not found middleware
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});
// endregion

// region Global error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// region exports
export default app;
// endregion
