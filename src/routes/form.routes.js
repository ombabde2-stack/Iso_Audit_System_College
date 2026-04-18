import express from "express";
import {createForm,getAllForms,getMyForms,getSingleForm} from "../controllers/form.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Submit form (faculty / hod depending on template)
router.post(
  "/",
  verifyJWT,
  authorizeRoles("faculty", "hod"),
  createForm
);

// Faculty own submissions
router.get(
  "/my",
  verifyJWT,
  authorizeRoles("faculty", "hod"),
  getMyForms
);

// Get all forms (HOD + Admin)
router.get(
  "/",
  verifyJWT,
  authorizeRoles("hod", "admin"),
  getAllForms
);

// Single form details
router.get(
  "/:id",
  verifyJWT,
  getSingleForm
);

export default router;