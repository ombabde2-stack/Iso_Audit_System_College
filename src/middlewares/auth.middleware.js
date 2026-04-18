import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Invalid or expired token");
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
      // Fetch user from DB (IMPORTANT)
      const user = await User.findById(decoded._id).select("-password");
  
      if (!user) {
         throw new ApiError(401,"User not found");
      }
  
      if (!user.isActive) {
        throw new ApiError(403,"Account deactivated");
      }
  
      // Attach user
      req.user = user;
  
      next();
    } 
    catch (error) {
      throw new ApiError(401, "Invalid or expired token");
    }
});

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user) {
      return next(new ApiError(401, "User not authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403,"Forbidden");
    }

    next();
  };
};

export const authorizeDepartment = () => {
  return (req, res, next) => {

    const userDept = req.user.department;
    const resourceDept = req.body.department || req.params.department;

    if (userDept !== resourceDept) {
      return next(new ApiError(403, "Access denied for this department"));
    }

    next();
  };
};