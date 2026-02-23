// region imports
import jwt from "jsonwebtoken";
import { env } from "../config/envConfig.js";
// endregion

// region generate tokens
export const generateToken = (id = "", expiresIn = "1h") => {
  return jwt.sign({ id }, env?.JWT_SECRET ?? "secret", { expiresIn });
};
// endregion

// region Verify Token
export const verifyToken = (token = "") => {
  return jwt.verify(token, env?.JWT_SECRET ?? "secret");
};
// endregion

// ---------------------------------------------------------------------------------------------
// region falshy check

export const isFalsyString = (value = "") => {
  if (typeof value !== "string") {
    return true;
  }
  const trimmed = value.trim();
  return (
    trimmed.length === 0 ||
    trimmed === "0" ||
    trimmed.toLowerCase() === "false" ||
    trimmed.toLowerCase() === "null" ||
    trimmed.toLowerCase() === "undefined"
  );
};
