import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUserService } from "../services/user.service.js";
import { loginUserService } from "../services/user.service.js";
import { logoutUserService } from "../services/user.service.js";
import { refreshTokenService } from "../services/user.service.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = asyncHandler(async (req, res, next) => {

  console.log("BODY:", req.body);

  const user = await registerUserService(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

const loginUser = asyncHandler(async (req, res) => {

  console.log("BODY:", req.body);

  const { user, accessToken, refreshToken } = 
    await loginUserService(req.body);

  // Set cookies (production standard)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure:  process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: user,
  });
});

const logoutUser = asyncHandler(async (req, res) => {

  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }

  await logoutUserService(req.user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {

  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const { accessToken, refreshToken } =
    await refreshTokenService(incomingRefreshToken);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  // 🍪 rotate tokens
  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Token refreshed",
    accessToken,
  });
});

export { registerUser,
         loginUser,
         logoutUser,
         refreshAccessToken  };