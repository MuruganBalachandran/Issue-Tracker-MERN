// region imports
// packages
import bcrypt from "bcryptjs";

// quereis
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
} from "../queries/userQueries.js";

// validations
import {
  validateSignup,
  validateLogin,
  validateUpdateProfile,
} from "../validations/authValidations.js";

// utils
import { publishEvent } from "../utils/eventPublisher.js";
import { generateToken, verifyToken } from "../utils/commonFunctions.js";
import { ROLES } from "../utils/constants.js";
import { KAFKA_TOPICS } from "../kafka/topics.js";
// endregion

// region SIGNUP
export const signup = async (req, res, next) => {
  try {
    // extract fields from request body
    const { Name = "", Email = "", Password = "", Role = "" } = req?.body || {};

    // validate fields using validateSignup
    const validation = validateSignup({ Name, Email, Password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error,
      });
    }

    // check whether email already exists
    const existingUser = await findUserByEmail(Email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // create user
    const user = await createUser({
      Name,
      Email,
      Password: hashedPassword,
      Role: ROLES.ADMIN,
      Email_Verified: 0,
    });

    // optionally send verification email
    // const verifyToken = generateToken(user._id, "15m");
    // await publishEvent(KAFKA_TOPICS.SEND_VERIFICATION_EMAIL, {
    //   Email: user?.Email,
    //   Name: user?.Name,
    //   token: verifyToken,
    // });

    // send response
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user,
    });
  } catch (err) {
    next(err);
  }
};
// endregion

// region LOGIN
export const login = async (req, res, next) => {
  try {
    const { Email = "", Password = "" } = req?.body || {};

    // validate fields
    const validation = validateLogin({ Email, Password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation?.error,
      });
    }

    // find user by email
    const user = await findUserByEmail(Email);

    // compare the password
    const isMatch =
      user && (await bcrypt.compare(Password, user?.Password || ""));
    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // check email verification if needed
    // if (!user.Email_Verified) {
    //   const error = new Error("Please verify your email first");
    //   error.status = 403;
    //   throw error;
    // }

    // generate JWT token
    const token = generateToken(user?._id || "");

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24,
    });

    // send response
    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};
// endregion

// region LOGOUT
export const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};
// region GET PROFILE
export const getProfile = async (req, res, next) => {
  try {
    // get user id from req.user
    const { _id } = req?.user || {};

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    // find user by _id
    const user = await findUserById(_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: err.message,
    });
  }
};
// endregion

// region UPDATE PROFILE
export const updateProfile = async (req, res, next) => {
  try {
    const { _id } = req?.user || {};
    const { Name = "" } = req?.body || {};

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    // find user by _id
    const user = await findUserById(_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // validate optional Name
    const validation = validateUpdateProfile({ Name });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error,
      });
    }

    // update user
    if (Name) user.Name = Name;

    const updatedUser = await user.save();

    // publish update event
    await publishEvent(KAFKA_TOPICS.USER_UPDATED, {
      User_Id: updatedUser._id.toString(),
      Name: updatedUser.Name,
      Email: updatedUser.Email,
      Role: updatedUser.Role || "user",
    });

    return res.json({
      success: true,
      updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: err.message,
    });
  }
};
// endregion

// region forget password
export const forgotPassword = async (req, res, next) => {
  try {
    // extract fields
    const { Email = "" } = req.body;
    // perform find user by email
    const user = await findUserByEmail(Email);

    // if user not found
    if (!user) {
      return res.json({
        success: true,
        message: "If the email exists, reset link sent",
      });
    }

    //  send reset link
    const resetToken = generateToken(user._id, "15m");

    //  send email via Kafka
    await publishEvent(KAFKA_TOPICS.SEND_PASSWORD_RESET_EMAIL, {
      Email: user.Email,
      Name: user.Name,
      token: resetToken,
    });

    // send response
    res.json({
      success: true,
      message: "Password reset link sent",
    });
  } catch (err) {
    next(err);
  }
};
// endregion

// region reset password
export const resetPassword = async (req, res, next) => {
  try {
    // extarct field
    const { token = "", Password = "" } = req.body;

    // verify JWT
    const decoded = verifyToken(token);
    const userId = decoded?.id;

    const user = await findUserById(userId);

    // if user not found
    if (!user) {
      const error = new Error("Invalid or expired reset token");
      error.status = 400;
      throw error;
    }

    // hash password again after setting new password
    const salt = await bcrypt.genSalt(10);
    user.Password = await bcrypt.hash(Password, salt);

    // save user
    await saveUser(user);

    // send response
    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    next(err);
  }
};
// endregion

// region verify email
export const verifyEmail = async (req, res, next) => {
  try {
    // extract fields
    const { token = "" } = req.query;

    // if no token
    if (!token) {
      const error = new Error("Invalid verification token");
      error.status = 400;
      throw error;
    }

    //  verify JWT
    const decoded = verifyToken(token);
    const userId = decoded?.id;

    // perform find user by id
    const user = await findUserById(userId);

    // if user not found
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    //  already verified check
    if (user.Email_Verified === 1) {
      return res.json({
        success: true,
        message: "Email already verified",
      });
    }

    //  mark verified
    user.Email_Verified = 1;
    await saveUser(user);

    //  publish USER_CREATED (welcome email trigger)
    await publishEvent(KAFKA_TOPICS.USER_CREATED, {
      User_Id: user?.User_Id || "",
      Name: user?.Name || "",
      Email: user?.Email || "",
      Role: user?.Role || "user",
    });

    // auto-login after verification
    const authToken = generateToken(user?._id || "");

    // set cookie
    res.cookie("token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24,
    });

    // send response
    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    next(err);
  }
};
// endregion
