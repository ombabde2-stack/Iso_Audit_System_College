import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshAccessToken,
  getMe, 
  forgotPassword, 
  resetPassword, 
  updateProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/me", verifyJWT, getMe);
router.patch("/update-profile", verifyJWT, upload.single("signature"), updateProfile);

export default router;
