import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAssignedForms } from "../controllers/formTemplate.controller.js";

const router = express.Router();

router.get(
  "/assigned",
  verifyJWT,
  getAssignedForms
);

export default router;