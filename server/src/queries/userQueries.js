// region imports
import User from "../models/UserModel.js";
// endregion

// region Find user by email
export const findUserByEmail = async (Email = "") => {
  const safeEmail = (Email || "").trim().toLowerCase();
  return User.findOne({ Email: safeEmail, Is_Deleted: 0 });
};
// endregion

// region Find user by id
export const findUserById = async (id = "") => {
  const safeId = id || "";
  return User.findOne({ User_Id: safeId, Is_Deleted: 0 });
};
// endregion

// region Create user
export const createUser = async (payload = {}) => {
  const safePayload = { ...payload };
  return User.create(safePayload);
};
// endregion

// region Update user
export const updateUser = async (id = "", updatePayload = {}) => {
  if (!id || Object.keys(updatePayload).length === 0) return null;
  return User.findOneAndUpdate(
    { User_Id: id, isDeleted: 0 },
    { $set: updatePayload },
    { new: true }, // return the updated document
  );
};
// endregion

// region Soft Delete user
export const softDeleteUser = async (id = "") => {
  if (!id) return null;
  return User.findOneAndUpdate(
    { User_Id: id, Is_Deleted: 0 },
    { $set: { Is_Deleted: 1 } },
    { new: true },
  );
};
// endregion
