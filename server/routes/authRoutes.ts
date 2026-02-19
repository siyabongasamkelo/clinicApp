import express from "express";
import dotenv from "dotenv";

// 1. Correct the extensions to .js (The ESM requirement)
import {
  verifyEmailRequest,
  registerUser,
  verifyEmail,
  loginUser,
  forgotPasswordLink,
  resetPassword,
} from "../controllers/authController.js";

import { authLimiter } from "../middleware/rateLimiter.js";

dotenv.config();

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data: # Updated to match your file upload logic
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string }
 *               file: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", authLimiter, registerUser);

router.post("/verify-email-request", authLimiter, verifyEmailRequest);
router.get("/confirmemail", authLimiter, verifyEmail);
router.post("/login", authLimiter, loginUser);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Reset link sent successfully
 */
router.post("/forgot-password", authLimiter, forgotPasswordLink);
router.post("/reset-password/:id/:token", authLimiter, resetPassword);

export default router;
