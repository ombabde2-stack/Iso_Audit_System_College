import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { updateFormStatus } from "../controllers/review.controller.js";

const router = express.Router();

// Only HOD can review
router.patch(
  "/:id/status",
  verifyJWT,
  authorizeRoles("hod"),
  updateFormStatus
);

export default router;