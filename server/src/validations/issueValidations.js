// region imports
import { isFalsyString } from "../utils/commonFunctions.js";
// endregion

// region helper - common error response
const validationError = (errors) => ({
  isValid: false,
  error: errors,
});
// endregion

// region individual field validators
const validateTitle = (Title = "") => {
  if (isFalsyString(Title)) return ["Title is required."];
  if (Title.trim().length < 2) return ["Title must be at least 2 characters."];
  return null;
};

const validateDescription = (Description = "") => {
  if (isFalsyString(Description)) return ["Description is required."];
  if (Description.trim().length < 5)
    return ["Description must be at least 5 characters."];
  return null;
};

const validatePriority = (Priority = "") => {
  const validPriorities = ["low", "medium", "high"];
  if (Priority && !validPriorities.includes(Priority)) {
    return [`Priority must be one of ${validPriorities.join(", ")}.`];
  }
  return null;
};

const validateStatus = (Status = "") => {
  const validStatus = ["todo", "in-progress", "done"];
  if (Status && !validStatus.includes(Status)) {
    return [`Status must be one of ${validStatus.join(", ")}.`];
  }
  return null;
};
// endregion

// region Create Issue validation
export const validateIssue = ({
  Title = "",
  Description = "",
  Priority = "medium",
}) => {
  const errors = {};

  const titleError = validateTitle(Title);
  if (titleError) errors.Title = titleError;

  const descriptionError = validateDescription(Description);
  if (descriptionError) errors.Description = descriptionError;

  const priorityError = validatePriority(Priority);
  if (priorityError) errors.Priority = priorityError;

  if (Object.keys(errors).length > 0) return validationError(errors);

  return { isValid: true, error: null };
};
// endregion

// region Update Issue validation (for reporter/user)
export const validateUpdateIssue = ({
  Title = "",
  Description = "",
  Priority = "",
}) => {
  const errors = {};

  if (Title) {
    const titleError = validateTitle(Title);
    if (titleError) errors.Title = titleError;
  }

  if (Description) {
    const descriptionError = validateDescription(Description);
    if (descriptionError) errors.Description = descriptionError;
  }

  if (Priority) {
    const priorityError = validatePriority(Priority);
    if (priorityError) errors.Priority = priorityError;
  }

  if (Object.keys(errors).length > 0) return validationError(errors);

  return { isValid: true, error: null };
};
// endregion

// region Update Status validation (for admin only)
export const validateUpdateIssueStatus = ({ Status = "" }) => {
  const errors = {};

  if (Status) {
    const statusError = validateStatus(Status);
    if (statusError) errors.Status = statusError;
  }

  if (Object.keys(errors).length > 0) return validationError(errors);

  return { isValid: true, error: null };
};
// endregion
