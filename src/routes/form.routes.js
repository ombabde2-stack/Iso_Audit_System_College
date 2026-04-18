import express from "express";
import {createForm,getAllForms} from "../controllers/form.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Submit form (faculty / hod depending on template)
router.post(
  "/",
  verifyJWT,
  authorizeRoles("faculty", "hod"),
  createForm
);

// Get all forms (HOD + Admin)
router.get(
  "/",
  verifyJWT,
  authorizeRoles("hod", "admin"),
  getAllForms
);

export default router;