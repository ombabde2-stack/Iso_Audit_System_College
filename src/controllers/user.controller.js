import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUserService } from "../services/user.service.js";
import { loginUserService } from "../services/user.service.js";

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

  // 🍪 Set cookies (production standard)
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

export { registerUser,
         loginUser  };