import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

import {
  verifyEmailRequest,
  registerUser,
  verifyEmail,
  loginUser,
} from "../controllers/authController.js";

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

router.post("/verify-email-request", verifyEmailRequest);

router.get("/confirmemail", verifyEmail);

router.post("/login", loginUser);

export default router;
