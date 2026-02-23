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
const validateName = (Name = "") => {
  if (isFalsyString(Name)) return ["Name is required."];
  if (Name.trim().length < 2) return ["Name must be at least 2 characters."];
  return null;
};

const validateEmail = (Email = "") => {
  if (isFalsyString(Email)) return ["Email is required."];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(Email.trim())) return ["Email is invalid."];
  return null;
};

const validatePassword = (Password = "", { Name = "", Email = "" } = {}) => {
  if (isFalsyString(Password)) return ["Password is required."];
  if (Password.length < 6) return ["Password must be at least 6 characters."];
  if (Name && Password.includes(Name.trim()))
    return ["Password should not contain your name."];
  if (Email && Password.includes(Email.trim()))
    return ["Password should not contain your email."];
  return null;
};
// endregion

// region Signup validation
export const validateSignup = ({ Name = "", Email = "", Password = "" }) => {
  const errors = {};

  const nameError = validateName(Name);
  if (nameError) {
    errors.Name = nameError;
  }

  const emailError = validateEmail(Email);
  if (emailError) {
    errors.Email = emailError;
  }

  const passwordError = validatePassword(Password, { Name, Email });
  if (passwordError) {
    errors.Password = passwordError;
  }

  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
};
// endregion

// region Login validation
export const validateLogin = ({ Email = "", Password = "" }) => {
  const errors = {};

  const emailError = validateEmail(Email);
  if (emailError) errors.Email = emailError;

  const passwordError = validatePassword(Password);
  if (passwordError) errors.Password = passwordError;

  if (Object.keys(errors).length > 0) return validationError(errors);

  return { isValid: true, error: null };
};
// endregion

// region Update Profile validation
export const validateUpdateProfile = ({
  Name = "",
  Email = "",
  Password = "",
}) => {
  const errors = {};

  // optional fields: only validate if present
  if (Name) {
    const nameError = validateName(Name);
    if (nameError) errors.Name = nameError;
  }

  if (Email) {
    const emailError = validateEmail(Email);
    if (emailError) errors.Email = emailError;
  }

  if (Password) {
    const passwordError = validatePassword(Password, { Name, Email });
    if (passwordError) errors.Password = passwordError;
  }

  if (Object.keys(errors).length > 0) return validationError(errors);

  return { isValid: true, error: null };
};
// endregion
