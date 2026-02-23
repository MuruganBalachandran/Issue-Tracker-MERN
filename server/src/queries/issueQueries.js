// queries/issueQueries.js
import Issue from "../models/IssueModel.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

// region CREATE ISSUE
export const createIssueQuery = async (payload = {}) => {
  // default Status to "todo" if not provided
  const { Status = "todo", ...safePayload } = payload ?? {};
  return Issue.create({ Status, ...safePayload });
};

// region GET ALL ISSUES
export const getAllIssuesQuery = async () => {
  return Issue.aggregate([
    { $match: { Is_deleted: { $ne: 1 } } }, // ignore deleted

    { $sort: { createdAt: -1 } },

    // Reporter lookup
    {
      $lookup: {
        from: "users",
        localField: "Reporter",
        foreignField: "_id",
        as: "Reporter",
      },
    },
    { $unwind: { path: "$Reporter", preserveNullAndEmptyArrays: true } },

    // Assignee lookup
    {
      $lookup: {
        from: "users",
        localField: "Assignee",
        foreignField: "_id",
        as: "Assignee",
      },
    },
    { $unwind: { path: "$Assignee", preserveNullAndEmptyArrays: true } },

    // Project only required fields
    {
      $project: {
        Title: 1,
        Description: 1,
        Status: 1,
        Priority: 1,
        Issue_Id: 1,
        createdAt: 1,

        "Reporter._id": 1,
        "Reporter.Name": 1,
        "Reporter.Email": 1,
        "Reporter.User_Id": 1,

        "Assignee._id": 1,
        "Assignee.Name": 1,
        "Assignee.Email": 1,
        "Assignee.User_Id": 1,
      },
    },
  ]);
};

// region FIND ISSUE BY ID (AGGREGATE)
export const findIssueByIssueId = async (Issue_Id = "") => {
  if (!Issue_Id) return null;

  const safeIssueId = new ObjectId(Issue_Id);

  const [issue] = await Issue.aggregate([
    { $match: { Issue_Id: safeIssueId, Is_deleted: { $ne: 1 } } }, // ignore deleted

    // Reporter lookup
    {
      $lookup: {
        from: "users",
        localField: "Reporter",
        foreignField: "_id",
        as: "Reporter",
      },
    },
    { $unwind: { path: "$Reporter", preserveNullAndEmptyArrays: true } },

    // Assignee lookup
    {
      $lookup: {
        from: "users",
        localField: "Assignee",
        foreignField: "_id",
        as: "Assignee",
      },
    },
    { $unwind: { path: "$Assignee", preserveNullAndEmptyArrays: true } },

    // Project only required fields
    {
      $project: {
        Title: 1,
        Description: 1,
        Status: 1,
        Priority: 1,
        Issue_Id: 1,
        createdAt: 1,
        "Reporter._id": 1,
        "Reporter.Name": 1,
        "Reporter.Email": 1,
        "Reporter.User_Id": 1,
        "Assignee._id": 1,
        "Assignee.Name": 1,
        "Assignee.Email": 1,
        "Assignee.User_Id": 1,
      },
    },
  ]);

  return issue ?? null;
};

// region FIND ISSUE DOC (NO AGGREGATE)
export const findIssueDocByIssueId = async (Issue_Id = "") => {
  if (!Issue_Id) return null;
  return Issue.findOne({ Issue_Id, Is_deleted: { $ne: 1 } }); // ignore deleted
};

// region SAVE ISSUE
export const saveIssueQuery = async (issueDoc = null) => {
  if (!issueDoc) return null;
  return issueDoc.save();
};

// region DELETE ISSUE (SOFT DELETE)
export const deleteIssueQuery = async (Issue_Id = "") => {
  if (!Issue_Id) return null;

  return Issue.findOneAndUpdate(
    { Issue_Id }, // match by Issue_Id
    { $set: { Is_deleted: 1 } }, // mark as deleted
    { new: true }, // return updated doc
  );
};
