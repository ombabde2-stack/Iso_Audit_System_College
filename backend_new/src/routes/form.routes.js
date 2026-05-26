import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { createForm, getAllForms, getMyForms, getSingleForm, downloadFormFile } from "../controllers/form.controller.js";
import { formSubmissionUpload } from "../middlewares/upload.middleware.js";

const NON_ADMIN_ROLES = [
  "hod", "assistantHeadAcademics", "assistantHeadResearch", "faculty",
  "classTeacher", "internshipCoordinator", "majorProjectCoordinator",
  "ediCoordinator", "studentActivityCoordinator", "studentPortfolioAlumniCoordinator", "budgetCoordinator",
];

const router = express.Router();

// Submit a form
router.post("/", verifyJWT, authorizeRoles(...NON_ADMIN_ROLES), formSubmissionUpload.single("submissionFile"), createForm);

// My submissions
router.get("/my", verifyJWT, authorizeRoles(...NON_ADMIN_ROLES), getMyForms);

// All forms (HOD/Admin)
router.get("/", verifyJWT, authorizeRoles("hod", "admin"), getAllForms);

// Single form
router.get("/:id", verifyJWT, getSingleForm);
router.get("/:id/download", verifyJWT, downloadFormFile);

export default router;
