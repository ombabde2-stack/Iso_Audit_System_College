import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { AuditLog } from "../models/auditLog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { sendPasswordResetEmail } from "./email.service.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
};

export const registerUserService = async (body) => {
  const { name, email, password, role, department, designation, employeeId, phone } = body;
  const exists = await User.findOne({ email });
  if (exists){
    throw new ApiError(409, "Email already registered.");
  };
  const user = await User.create({ name, email, password, role, department, designation, employeeId, phone });
  return { 
    _id: user._id, 
    name: user.name, 
    email: user.email, 
    role: user.role, 
    department: user.department
  };
};

export const loginUserService = async ({ email, password }, ip) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) throw new ApiError(401, "Invalid email or password.");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password.");

  user.lastLogin = new Date();
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await user.save();

  await AuditLog.create({ user: user._id, userName: user.name, action: "LOGIN", ip, details: { email } });

  return {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, designation: user.designation, isActive: user.isActive, signatureUrl: user.signatureUrl },
    accessToken, refreshToken, cookieOptions: COOKIE_OPTIONS,
  };
};

export const logoutUserService = async (userId) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1, refreshTokenExpiry: 1 } });
};

export const refreshTokenService = async (incomingToken) => {
  let decoded;
  try {
    decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token.");
  }

  const user = await User.findById(decoded._id).select("+refreshToken");
  if (!user || user.refreshToken !== incomingToken) throw new ApiError(401, "Refresh token mismatch. Please login again.");
  if (!user.refreshTokenExpiry || user.refreshTokenExpiry < new Date()) {
    user.refreshToken = undefined;
    user.refreshTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(401, "Refresh token has expired. Please login again.");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await user.save();
  return { accessToken, refreshToken, cookieOptions: COOKIE_OPTIONS };
};

export const getMeService = async (userId) => {
  const user = await User.findById(userId).select("-password -refreshToken -passwordResetToken");
  if (!user) throw new ApiError(404, "User not found.");
  return user;
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "No user found with this email.");
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.passwordResetToken = hashedToken;
  user.passwordResetExpiry = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
  const emailSent = await sendPasswordResetEmail(user, resetUrl);
  
  if (!emailSent && process.env.NODE_ENV === "production") {
    throw new ApiError(500, "Failed to send password reset email. Please contact support.");
  }

  return { 
    message: emailSent 
      ? "Password reset link sent to your email." 
      : "Password reset token generated (but email sending failed - check server logs)." 
  };
};

export const resetPasswordService = async (rawToken, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpiry: { $gt: Date.now() } }).select("+password");
  if (!user) throw new ApiError(400, "Reset token is invalid or has expired.");
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;
  user.refreshToken = undefined;
  await user.save();
  return { message: "Password reset successful. Please login with your new password." };
};

export const updateProfileService = async (userId, data) => {
  const allowedUpdates = ["name", "phone", "designation", "signatureUrl"];
  const updates = {};
  
  Object.keys(data).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = data[key];
    }
  });

  const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true })
    .select("-password -refreshToken -passwordResetToken");

  if (!user) throw new ApiError(404, "User not found.");
  return user;
};
