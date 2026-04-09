import express from "express";
import dotenv from "dotenv";

// 1. Correct the extensions to .js (The ESM requirement)
import {
  registerLite,
  login,
  getResetPasswordLink,
  resetPassword,
  verifyAccount,
  verifyEmailRequest,
} from "../controllers/authController.js";
import { validate } from "../middleware/validate.middleware";

import { authLimiter } from "../middleware/rateLimiter.js";
import {
  userLightRegisterSchema,
  LoginSchema,
  ResetPasswordLinkSchema,
  ResetPasswordSchema,
  VerifyAccountSchema,
} from "../validation/auth.schema";

dotenv.config();

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  validate(userLightRegisterSchema),
  registerLite,
);

router.post("/login", authLimiter, validate(LoginSchema), login);
router.post(
  "/forgot-password",
  authLimiter,
  validate(ResetPasswordLinkSchema),
  getResetPasswordLink,
);

router.post(
  "/reset-password",
  authLimiter,
  validate(ResetPasswordSchema),
  resetPassword,
);

router.post(
  "/verify-account",
  authLimiter,
  validate(VerifyAccountSchema),
  verifyAccount,
);

router.post(
  "/verify-email-request",
  authLimiter,
  validate(ResetPasswordLinkSchema),
  verifyEmailRequest,
);

export default router;
