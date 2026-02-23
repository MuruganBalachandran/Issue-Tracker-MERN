// region imports
import express from "express";
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  updateIssueStatus,
} from "../controllers/issueController.js";
import { auth } from "../middlewares/authMiddleware.js";
// endregion

// create express router
const router = express.Router();

// region  Protected routes
router.use(auth());
// Create
router.post("/", createIssue);

// Read
router.get("/", getIssues);
router.get("/:id", getIssueById);

// Update
router.put("/:id", updateIssue);
router.put("/:id/status", auth("ADMIN"), updateIssueStatus);

// Delete
router.delete("/:id", deleteIssue);

// region exports
export default router;
// endregion
