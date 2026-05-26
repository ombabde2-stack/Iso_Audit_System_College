import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getDashboard, getResearchAnalytics } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", verifyJWT, getDashboard);
router.get("/research-analytics", verifyJWT, getResearchAnalytics);

export default router;
