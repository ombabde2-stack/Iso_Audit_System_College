// services/user.service.js
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
 
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

  const email = data.email?.toLowerCase();

  if (!name?.trim() || !email?.trim() || !password?.trim() || !role) {
    throw new ApiError(400, "All fields are required");
  }

  // Role-based validation
  if (role === "faculty" && !employeeId) {
    throw new ApiError(400, "Employee ID is required");
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

  const email = data.email?.toLowerCase();

  const {password } = data;

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

export { registerUserService,
         loginUserService
};