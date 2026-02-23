// region imports
import {
  createIssueQuery,
  getAllIssuesQuery,
  findIssueByIssueId,
  findIssueDocByIssueId,
  saveIssueQuery,
  deleteIssueQuery,
} from "../queries/issueQueries.js";

import {
  validateIssue,
  validateUpdateIssue,
  validateUpdateIssueStatus,
} from "../validations/issueValidations.js";

import { publishEvent } from "../utils/eventPublisher.js";
import { KAFKA_TOPICS } from "../kafka/topics.js";
// endregion

// region CREATE ISSUE
export const createIssue = async (req, res, next) => {
  try {
    const {
      Title = "",
      Description = "",
      Priority = "medium",
      Assignee = null,
    } = req.body || {};

    // validate input
    const validation = validateIssue({
      Title,
      Description,
      Priority,
    });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error,
      });
    }

    const payload = {
      Title,
      Description,
      Priority,
      Reporter: req.user?._id || null,
      Assignee,
    };

    const issue = await createIssueQuery(payload);

    await publishEvent(KAFKA_TOPICS.ISSUE_CREATED, {
      Issue_Id: issue?.Issue_Id || "",
      Title: issue?.Title || "",
      Reporter: issue?.Reporter || "",
      Priority: issue?.Priority || "",
    });

    return res.status(201).json({
      success: true,
      issue,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create issue",
      error: err.message,
    });
  }
};
// endregion

// region GET ALL ISSUES
export const getIssues = async (req, res, next) => {
  try {
    const issues = await getAllIssuesQuery();

    return res.json({
      success: true,
      count: issues?.length || 0,
      issues,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch issues",
      error: err.message,
    });
  }
};
// endregion

// region GET ISSUE BY ID
export const getIssueById = async (req, res, next) => {
  try {
    const issueId = req.params?.id || "";

    const issue = await findIssueByIssueId(issueId);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.json({
      success: true,
      issue,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch issue",
      error: err.message,
    });
  }
};
// endregion

// region UPDATE ISSUE (by reporter/user)
export const updateIssue = async (req, res, next) => {
  try {
    const issueId = req.params?.id || "";
    const { Title, Description, Priority, Assignee } = req.body || {};

    const validation = validateUpdateIssue({ Title, Description, Priority });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error,
      });
    }

    const issueDoc = await findIssueDocByIssueId(issueId);
    if (!issueDoc) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    if (issueDoc.Reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update issues you created",
      });
    }

    if (Title) issueDoc.Title = Title;
    if (Description) issueDoc.Description = Description;
    if (Priority) issueDoc.Priority = Priority;
    if (Assignee) issueDoc.Assignee = Assignee;

    const updatedIssue = await saveIssueQuery(issueDoc);

    await publishEvent(KAFKA_TOPICS.ISSUE_UPDATED, {
      Issue_Id: updatedIssue?.Issue_Id || "",
      Title: updatedIssue?.Title || "",
      Status: updatedIssue?.Status || "",
      Priority: updatedIssue?.Priority || "",
      Assignee: updatedIssue?.Assignee || null,
    });

    return res.json({
      success: true,
      issue: updatedIssue,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update issue",
      error: err.message,
    });
  }
};
// endregion

// region UPDATE ISSUE STATUS (Admin only)
export const updateIssueStatus = async (req, res, next) => {
  try {
    const issueId = req.params?.id || "";
    const { Status } = req.body || {};

    const validation = validateUpdateIssueStatus({ Status });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error,
      });
    }

    const issueDoc = await findIssueDocByIssueId(issueId);
    if (!issueDoc) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    issueDoc.Status = Status;

    const updatedIssue = await saveIssueQuery(issueDoc);

    await publishEvent(KAFKA_TOPICS.ISSUE_UPDATED, {
      Issue_Id: updatedIssue?.Issue_Id || "",
      Title: updatedIssue?.Title || "",
      Status: updatedIssue?.Status || "",
      Priority: updatedIssue?.Priority || "",
      Assignee: updatedIssue?.Assignee || null,
    });

    return res.json({
      success: true,
      issue: updatedIssue,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update issue status",
      error: err.message,
    });
  }
};
// endregion

// region DELETE ISSUE
export const deleteIssue = async (req, res, next) => {
  try {
    const issueId = req.params?.id || "";

    const deletedIssue = await deleteIssueQuery(issueId);
    if (!deletedIssue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    await publishEvent(KAFKA_TOPICS.ISSUE_DELETED, {
      Issue_Id: deletedIssue?.Issue_Id || "",
      Title: deletedIssue?.Title || "",
    });

    return res.json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete issue",
      error: err.message,
    });
  }
};
// endregion
