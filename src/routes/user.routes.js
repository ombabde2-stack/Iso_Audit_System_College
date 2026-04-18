import express from "express";
import { refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/user.controller.js";
import { authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.get("/admin", verifyJWT, authorizeRoles("admin"), (req, res) => {
  res.send("Admin only");
});

router.get("/faculty", verifyJWT, authorizeRoles("faculty"), (req, res) => {
  res.send("Faculty only");
});


export default router;