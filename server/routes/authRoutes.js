import express from "express";
const router = express.Router();
import { confirmEmail, registerUser } from "../controllers/authController.js";
import { loginUser } from "../controllers/authController.js";
import { getUser } from "../controllers/authController.js";
import { getAllUsers } from "../controllers/authController.js";
import { deleteUser } from "../controllers/authController.js";
import { updateUser } from "../controllers/authController.js";
import { forgotPassword } from "../controllers/authController.js";
import { resetPassword } from "../controllers/authController.js";

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get/:userId", getUser);
router.get("/get", getAllUsers);
router.delete("/delete/:userId", deleteUser);
router.put("/update/:userId", updateUser);
router.post("/confirmemail", confirmEmail);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:userId/:token", resetPassword);

export default router;
