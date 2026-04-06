// services/user.service.js
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const registerUserService = async (data) => {
  const {
    name,
    email,
    password,
    role,
    rollNumber,
    employeeId,
  } = data;

  // 1) Validate input
  if (!name?.trim() || !email?.trim() || !password?.trim() || !role) {
    throw new ApiError(400, "All fields are required");
  }

  // Role-based validation
  if (role === "student" && !rollNumber) {
    throw new ApiError(400, "Roll number is required");
  }

  if (role === "faculty" && !employeeId) {
    throw new ApiError(400, "Employee ID is required");
  }

  // 2️) Check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // 3️) Create user (password hashed via model)
  const user = await User.create({
    name,
    email,
    password,
    role,
    rollNumber,
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

export { registerUserService };