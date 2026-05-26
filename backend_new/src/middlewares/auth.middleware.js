import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Access token missing. Please login.");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password -refreshToken -passwordResetToken");

    if (!user) throw new ApiError(401, "User not found. Token invalid.");
    if (!user.isActive) throw new ApiError(403, "Account deactivated. Contact admin.");

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Invalid or expired access token.");
  }
});

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return next(new ApiError(401, "Not authenticated."));
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Access denied. Role '${req.user.role}' is not authorized.`));
    }
    next();
  };
};

export const authorizeDepartment = () => {
  return (req, res, next) => {
    if (req.user.role === "admin") return next();
    const userDept = req.user.department;
    const resourceDept = req.body.department || req.params.department || req.query.department;
    if (resourceDept && userDept !== resourceDept) {
      return next(new ApiError(403, "Access denied for this department."));
    }
    next();
  };
};
