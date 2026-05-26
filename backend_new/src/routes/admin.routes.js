import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getAllUsers, updateUserRole, toggleUserStatus, deleteUser,
  adminResetPassword, getAuditLogs, getAdminFormStats,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All admin-only routes
router.use(verifyJWT, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/toggle-status", toggleUserStatus);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/reset-password", adminResetPassword);
router.get("/audit-logs", getAuditLogs);
router.get("/form-stats", getAdminFormStats);

export default router;
