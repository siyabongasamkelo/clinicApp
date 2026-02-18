import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

import {
  verifyEmailRequest,
  registerUser,
  verifyEmail,
  loginUser,
  forgotPasswordLink,
  resetPassword,
} from "../controllers/authController.ts";

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
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link sent successfully
 *       404:
 *         description: User not found
 */
router.post("/forgot-password", forgotPasswordLink);

// router.post("/forgot-password", forgotPasswordLink);

router.post("/reset-password/:id/:token", resetPassword);

export default router;
