// services/user.service.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const ALLOWED_ROLES = ["admin", "faculty", "hod"];

const registerUserService = async (data) => {
  const {
    name,
    email,
    password,
    role,
    department,
    employeeId,
  } = data;

  // 1) Validate input

  email = email?.toLowerCase();

  if (!name?.trim() || !email?.trim() || !password?.trim() || !role) {
    throw new ApiError(400, "All fields are required");
  }

  // Role-based validation
  if (!ALLOWED_ROLES.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  if (role === "faculty" && !employeeId) {
    throw new ApiError(400, "Employee ID is required for faculty");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // 2️) Check existing user
  const existingUser = await User.findOne({email});
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // 3️) Create user entry in database
  console.log(data);
  const user = await User.create({
    name,
    email,
    password,
    role,
    department,
    employeeId,
  });

  // 4️) Check creation
  if (!user) {
    throw new ApiError(500, "User registration failed");
  }

  // 5️) Remove sensitive fields
  const safeUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return safeUser;
};

const loginUserService = async (data) => {

  const {email, password } = data;
  email = email?.toLowerCase();

  // 1. Validate input
  if (!email || !password) {
    throw new ApiError(400, "Invalid email or password");
  }

  // 2. Find user (include password manually)
  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (!user.isActive) {
    throw new ApiError(403, "Account is deactivated");
  }

  // 3. Check account lock
  if (user.isAccountLocked()) {
    throw new ApiError(403, "Account is locked. Try again later");
  }

  // 4. Compare password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    await user.incrementLoginAttempts();
    throw new ApiError(401, "Invalid email or password");
  }

  // 5. Reset login attempts
  await user.resetLoginAttempts();

  // 6. Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // 7. Save refresh token in DB
  user.refreshToken = refreshToken;
  user.refreshTokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  user.lastLogin = new Date();

  await user.save({ validateBeforeSave: false });

  // 8. Return safe data
  return {
     user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    },
    accessToken,
    refreshToken
  };
};

const logoutUserService = async (userId) => {

  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, "User not found");

  user.refreshToken = null;
  user.refreshTokenExpiry = null;

  await user.save();

  return true;
};

const refreshTokenService = async (incomingRefreshToken) => {

  // Verify token
  let decoded;

  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } 
  catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  // 2️⃣ Find user
  const user = await User.findById(decoded._id).select("+refreshToken");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  // 3️⃣ Match token (CRITICAL SECURITY)
  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token mismatch");
  }

  // 4️⃣ Check expiry (extra safety)
  if (user.refreshTokenExpiry < Date.now()) {
    throw new ApiError(401, "Refresh token expired");
  }

  // 5️⃣ Generate new tokens (ROTATION 🔥)
  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  // 6️⃣ Save new refresh token
  user.refreshToken = newRefreshToken;
  user.refreshTokenExpiry =
    Date.now() + 7 * 24 * 60 * 60 * 1000;

  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export { registerUserService,
         loginUserService,
         logoutUserService,
         refreshTokenService
};