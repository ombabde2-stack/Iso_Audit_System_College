import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { updateFormStatus, getHODQueue } from "../controllers/review.controller.js";

const router = express.Router();

// HOD queue
router.get("/queue", verifyJWT, authorizeRoles("hod"), getHODQueue);

// HOD approves/rejects/returns
router.patch("/:id/status", verifyJWT, authorizeRoles("hod", "admin"), updateFormStatus);

export default router;
