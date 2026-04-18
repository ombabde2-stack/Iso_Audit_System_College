import express from "express";
import { refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/user.controller.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

// router.post(
//   "/create-form",
//   verifyJWT,
//   authorizeRoles("faculty"),
//   createForm
// );

// router.post(
//   "/review/:id",
//   verifyJWT,
//   authorizeRoles("hod"),
//   reviewForm
// );

export default router;