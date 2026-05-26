import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getMyTemplates, 
  getMyTemplateByFormNo, 
  getAllTemplates, 
  createTemplate, 
  updateTemplate,
} from "../controllers/formTemplate.controller.js";

const router = express.Router();

// Get templates for current user's role
router.get("/my", verifyJWT, getMyTemplates);
router.get("/my/:formNo", verifyJWT, getMyTemplateByFormNo);

// Admin only
router.get("/", verifyJWT, authorizeRoles("admin"), getAllTemplates);
router.post("/", verifyJWT, authorizeRoles("admin"), createTemplate);
router.patch("/:id", verifyJWT, authorizeRoles("admin"), updateTemplate);

export default router;
