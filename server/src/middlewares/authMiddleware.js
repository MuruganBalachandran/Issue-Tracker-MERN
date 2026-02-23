// region imports
import User from "../models/UserModel.js";
import { findUserById } from "../queries/userQueries.js";
import { verifyToken } from "../utils/commonFunctions.js";
// endregion

// Combined Auth Middleware
export const auth = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      let token = "";

      // Extract token from header
      const authHeader = req.headers?.authorization ?? "";
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1] ?? "";
      }

      // Optional cookie support
      if (!token && req.cookies?.token) {
        token = req.cookies.token ?? "";
      }

      // Token missing
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, token missing",
        });
      }

      // Verify token
      const decoded = verifyToken(token);

      // Find user
      const user = findUserById(decoded?.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // Role check (if roles are specified)
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.Role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient permissions",
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token invalid",
        error: err.message,
      });
    }
  };
};
