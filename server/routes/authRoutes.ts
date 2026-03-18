import express from "express";
import dotenv from "dotenv";

// 1. Correct the extensions to .js (The ESM requirement)
import {
  loginDoctor,
  loginPatient,
  // verifyEmailRequest,
  // registerUser,
  // verifyEmail,
  // loginUser,
  registerDoctor,
  registerNurse,
  registerPatient,
  verifyDoctorAccount,
  verifyNurseAccount,
  verifyPatientAccount,
  patientForgotPasswordLink,
  doctorForgotPasswordLink,
  nurseForgotPasswordLink,
  patientResetPassword,
  doctorResetPassword,
  nurseResetPassword,

  // forgotPasswordLink,
  // resetPassword,
} from "../controllers/authController.js";
import { validate } from "../middleware/validate.middleware";

import { authLimiter } from "../middleware/rateLimiter.js";
import {
  doctorRegistrationSchema,
  patientRegistrationSchema,
  nurseRegistrationSchema,
  patientLoginSchema,
  staffLoginSchema,
  emailVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validation/auth.schema";

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
// router.post("/register", authLimiter, registerUser);

// router.post("/verify-email-request", authLimiter, verifyEmailRequest);
// router.post("/confirmemail", authLimiter, verifyEmail);
// router.post("/login", authLimiter, validate(loginSchema), loginUser);

//---------------------------- register routes---------------------------------------//
router.post(
  "/register/doctor",
  authLimiter,
  validate(doctorRegistrationSchema),
  registerDoctor,
);

router.post(
  "/register/patient",
  authLimiter,
  validate(patientRegistrationSchema),
  registerPatient,
);

router.post(
  "/register/nurse",
  authLimiter,
  validate(nurseRegistrationSchema),
  registerNurse,
);

//---------------------------- login routes---------------------------------------//

router.post(
  "/login/patient",
  authLimiter,
  validate(patientLoginSchema),
  loginPatient,
);

router.post(
  "/login/doctor",
  authLimiter,
  validate(staffLoginSchema),
  loginDoctor,
);

//---------------------------- verify routes---------------------------------------//
router.post(
  "/verify/patient",
  authLimiter,
  validate(emailVerificationSchema),
  verifyPatientAccount,
);

router.post(
  "/verify/doctor",
  authLimiter,
  validate(emailVerificationSchema),
  verifyDoctorAccount,
);

router.post(
  "/verify/nurse",
  authLimiter,
  validate(emailVerificationSchema),
  verifyNurseAccount,
);

//---------------------------- forgotpassword routes---------------------------------------//

router.post(
  "/forgotpassword/patient",
  authLimiter,
  validate(forgotPasswordSchema),
  patientForgotPasswordLink,
);

router.post(
  "/forgotpassword/doctor",
  authLimiter,
  validate(forgotPasswordSchema),
  doctorForgotPasswordLink,
);

router.post(
  "/forgotpassword/nurse",
  authLimiter,
  validate(forgotPasswordSchema),
  nurseForgotPasswordLink,
);

//---------------------------- forgotpassword routes---------------------------------------//

router.post(
  "/resetpassword/patient",
  authLimiter,
  validate(resetPasswordSchema),
  patientResetPassword,
);

router.post(
  "/resetpassword/doctor",
  authLimiter,
  validate(resetPasswordSchema),
  doctorResetPassword,
);

router.post(
  "/resetpassword/nurse",
  authLimiter,
  validate(resetPasswordSchema),
  nurseResetPassword,
);

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
// router.post("/forgot-password", authLimiter, forgotPasswordLink);
// router.post("/reset-password", authLimiter, resetPassword);

export default router;
