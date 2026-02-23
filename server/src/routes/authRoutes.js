// routes/userRoutes.js
import express from "express";
import {
  signup,
  login,
  getProfile,
  updateProfile,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// region Public routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
// endregion

// region Protected routes
router.post("/logout", auth(), logout);
router.get("/profile", auth(), getProfile);
router.put("/profile", auth(), updateProfile);
// endregion

// region exports
export default router;
// endregion
