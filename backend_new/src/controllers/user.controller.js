import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  registerUserService, loginUserService, logoutUserService,
  refreshTokenService, getMeService, forgotPasswordService, resetPasswordService,
  updateProfileService,
} from "../services/user.service.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const COOKIE_OPTIONS = (days = 1) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: days * 24 * 60 * 60 * 1000,
});

export const registerUser = asyncHandler(async (req, res) => {
  const user = await registerUserService(req.body);
  res.status(201).json(new ApiResponse(201, user, "User registered successfully."));
});

export const loginUser = asyncHandler(async (req, res) => {
  const ip = req.ip || req.headers["x-forwarded-for"];
  const { user, accessToken, refreshToken } = await loginUserService(req.body, ip);

  res
    .cookie("accessToken", accessToken, COOKIE_OPTIONS(1 / 24)) // 1 hour
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS(7))
    .status(200)
    .json(new ApiResponse(200, { user, accessToken }, "Login successful."));
});

export const logoutUser = asyncHandler(async (req, res) => {
  await logoutUserService(req.user._id);
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };
  res
    .clearCookie("accessToken", opts)
    .clearCookie("refreshToken", opts)
    .status(200)
    .json(new ApiResponse(200, null, "Logout successful."));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.refreshToken || req.body.refreshToken;
  const { accessToken, refreshToken } = await refreshTokenService(incoming);
  res
    .cookie("accessToken", accessToken, COOKIE_OPTIONS(1 / 24))
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS(7))
    .status(200)
    .json(new ApiResponse(200, { accessToken }, "Token refreshed."));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await getMeService(req.user._id);
  res.status(200).json(new ApiResponse(200, user, "Profile fetched."));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await forgotPasswordService(req.body.email);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await resetPasswordService(req.params.token, req.body.password);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

export const updateProfile = asyncHandler(async (req, res) => {
  let updateData = { ...req.body };
  
  if (req.file) {
    const signature = await uploadOnCloudinary(req.file.path, "signatures");
    if (signature) {
      updateData.signatureUrl = signature.secure_url;
    }
  }

  const user = await updateProfileService(req.user._id, updateData);
  res.status(200).json(new ApiResponse(200, user, "Profile updated successfully."));
});
