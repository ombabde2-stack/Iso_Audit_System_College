import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get(
  "/",
  verifyJWT,
  authorizeRoles("faculty", "hod"),
  getDashboard
);

export default router;