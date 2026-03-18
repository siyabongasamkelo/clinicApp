import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.js";
import express from "express";
import type { Request, Response, NextFunction } from "express";
// import type { NextFunction, Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import { Patient } from "../models/patientModel.js";
import { Doctor } from "../models/doctorModel.js";
import { Nurse } from "../models/nurseModel.js";
import {
  DoctorRegistrationInput,
  NurseRegistrationInput,
  PatientLoginInput,
  patientLoginSchema,
  PatientRegistrationInput,
  staffLoginInput,
  staffLoginSchema,
  emailVerificationSchema,
  EmailVerificationInput,
  ForgotPasswordInput,
  ResetPasswordinInput,
  resetPasswordSchema,
} from "../validation/auth.schema.js";
import type { PatientType } from "../models/patientModel.js";
import { HydratedDocument } from "mongoose";

dotenv.config();
// helping functions
const createToken = (id: string): string => {
  const jwtKey = process.env.JWT_SECRETE_KEY as string;

  if (!jwtKey) {
    throw new Error(
      "JWT_SECRETE_KEY is not defined in the environment variables",
    );
  }

  return jwt.sign({ id }, jwtKey, { expiresIn: "3d" });
};

const sendVerificationEmail = async (email: string, token: string) => {
  // Build verification link
  // const baseUrl = process.env.BASEURL?.replace(/\/+$/, "") || "";
  const baseUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "") || "";

  const verificationLink = `${baseUrl}/auth/confirmemail?email=${encodeURIComponent(
    email,
  )}&token=${encodeURIComponent(token)}`;

  // Send email
  try {
    await sendEmail({
      to: email,
      subject: "Verify Your Account",
      html: `<h1>Welcome!</h1>
                 <p>Please verify your account by clicking the link below:</p>
                 <a href="${verificationLink}">Verify Account</a>`,
      text: `Please verify your account by visiting: ${verificationLink}`,
    });
  } catch (emailErr) {
    console.error("Email sending failed:", emailErr);
  }
};

const sendForgotPassowrdLinkEmail = async (resetUrl: string, user: any) => {
  // Define the Email Content
  const htmlContent = `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset My Password</a>
        <p>This link is valid for <b>20 minutes</b> only.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

  // Send Email using your reusable helper
  await sendEmail({
    to: user.email,
    subject: "Reset your Clinic App Password",
    html: htmlContent,
    text: `Reset your password here: ${resetUrl}`,
  });
};

//------------------register Account------------------///

export const registerDoctor = async (
  req: Request<{}, {}, DoctorRegistrationInput>,
  res: Response,
  next: NextFunction,
) => {
  // 2. Change return type to void since middleware handles response
  try {
    // 1. Upload file (we know it exists because of Zod)
    const file = req.files!.profilePhoto as any;
    const photoUrl = await uploadToCloudinary(file.tempFilePath, "doctors");

    // 2. Save to DB
    const newDoctor = new Doctor({
      ...req.body,
      profilePhoto: photoUrl,
    });

    await newDoctor.save();

    //sending email

    const token = createToken(newDoctor._id.toString());

    try {
      await sendVerificationEmail(newDoctor.email, token);
    } catch (err) {
      console.log(err);
      return next(
        new ApiError(
          502,
          "We couldn't send the verification email. Please try again later.",
        ),
      );
    }

    res.status(201).json({ message: "Doctor created successfully" });
  } catch (err: any) {
    // 6. The "Magic" - pass any unexpected error (DB crash, etc.) to the handler
    next(err);
  }
};

export const registerPatient = async (
  req: Request<{}, {}, PatientRegistrationInput>,
  res: Response,
  next: NextFunction,
) => {
  // 2. Change return type to void since middleware handles response
  try {
    // 1. Upload file (we know it exists because of Zod)
    const file = req.files!.profilePhoto as any;
    const photoUrl = await uploadToCloudinary(file.tempFilePath, "doctors");

    // 2. Save to DB
    const newPatient = new Patient({
      ...req.body,
      profilePhoto: photoUrl,
    });

    await newPatient.save();

    const token = createToken(newPatient._id.toString());

    try {
      await sendVerificationEmail(newPatient.email, token);
    } catch (err) {
      console.log(err);
      return next(
        new ApiError(
          502,
          "We couldn't send the verification email. Please try again later.",
        ),
      );
    }

    res.status(201).json({
      message:
        "Patient created successfully please check you email and verify your account",
    });
  } catch (err: any) {
    // 6. The "Magic" - pass any unexpected error (DB crash, etc.) to the handler
    next(err);
  }
};

export const registerNurse = async (
  req: Request<{}, {}, NurseRegistrationInput>,
  res: Response,
  next: NextFunction,
) => {
  // 2. Change return type to void since middleware handles response
  try {
    // 1. Upload file (we know it exists because of Zod)
    const file = req.files!.profilePhoto as any;
    const photoUrl = await uploadToCloudinary(file.tempFilePath, "doctors");

    // 2. Save to DB
    const newNurse = new Nurse({
      ...req.body,
      profilePhoto: photoUrl,
    });

    await newNurse.save();

    //sending email
    await newNurse.save();

    const token = createToken(newNurse._id.toString());

    try {
      await sendVerificationEmail(newNurse.email, token);
    } catch (err) {
      console.log(err);
      return next(
        new ApiError(
          502,
          "We couldn't send the verification email. Please try again later.",
        ),
      );
    }

    res.status(201).json({ message: "Nurse created successfully" });
  } catch (err: any) {
    // 6. The "Magic" - pass any unexpected error (DB crash, etc.) to the handler
    next(err);
  }
};

//------------------login Account------------------///

export const loginPatient = async (
  req: Request<{}, {}, PatientLoginInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const { email, password, role } = req.body || {};

    const validated = patientLoginSchema.parse(req);

    // 2. Access the nested body
    const { email, password, role } = validated.body;

    if (role !== "PATIENT")
      return next(new ApiError(404, "We're only looking for patients"));

    const patient: HydratedDocument<any> = await Patient.findOne({
      email,
    }).select("+password");

    // If you prefer to avoid user enumeration, do not reveal existence
    if (!patient) {
      // return res.status(404).json({ message: "User not found." });
      return next(new ApiError(404, "User not found."));
    }

    if (patient.isVerified === false) {
      // return res.status(401).json({ message: "Please verify your email." });
      return next(new ApiError(401, "Please verify your email."));
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, patient.password);
    if (!isPasswordValid) {
      // return res.status(401).json({ message: "Invalid email or password." });
      return next(new ApiError(401, "Invalid email or password."));
    }

    // Create and send token
    const token = createToken(patient._id.toString());

    logger.info(`User logged in: ${patient.email}`);

    const { password: _pw, __v, ...patientData } = patient.toObject() as any;

    return res.status(201).json({
      status: "success",
      message: "logged in successfully",
      token,
      data: {
        patientData,
      },
    });
  } catch (err) {
    console.error("User login error:", err);
    // return res.status(500).json({ message: "An unexpected error occurred." });
    return next(new ApiError(500, "An unexpected error occurred."));
  }
};

export const loginDoctor = async (
  req: Request<{}, {}, staffLoginInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const { email, password, role } = req.body || {};

    const validated = staffLoginSchema.parse(req);

    // 2. Access the nested body
    const { staffId, password, role } = validated.body;

    if (role !== "DOCTOR")
      return next(new ApiError(404, "We're only looking for doctors"));

    const doctor: HydratedDocument<any> = await Doctor.findOne({
      staffId,
    }).select("+password");

    // If you prefer to avoid user enumeration, do not reveal existence
    if (!doctor) {
      // return res.status(404).json({ message: "User not found." });
      return next(new ApiError(404, "User not found."));
    }

    if (doctor.isVerified === false) {
      // return res.status(401).json({ message: "Please verify your email." });
      return next(new ApiError(401, "Please verify your email."));
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      // return res.status(401).json({ message: "Invalid email or password." });
      return next(new ApiError(401, "Invalid email or password."));
    }

    // Create and send token
    const token = createToken(doctor._id.toString());

    logger.info(`User logged in: ${doctor.email}`);

    const { password: _pw, __v, ...patientData } = doctor.toObject() as any;

    return res.status(201).json({
      status: "success",
      message: "User logged in successfully",
      token,
      data: {
        patientData,
      },
    });
  } catch (err) {
    console.error("User login error:", err);
    // return res.status(500).json({ message: "An unexpected error occurred." });
    return next(new ApiError(500, "An unexpected error occurred."));
  }
};

export const loginNurse = async (
  req: Request<{}, {}, staffLoginInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const { email, password, role } = req.body || {};

    const validated = staffLoginSchema.parse(req);

    // 2. Access the nested body
    const { staffId, password, role } = validated.body;

    if (role !== "NURSE")
      return next(new ApiError(404, "We're only looking for nurse"));

    const nurse: HydratedDocument<any> = await Nurse.findOne({
      staffId,
    }).select("+password");

    // If you prefer to avoid user enumeration, do not reveal existence
    if (!nurse) {
      // return res.status(404).json({ message: "User not found." });
      return next(new ApiError(404, "User not found."));
    }

    if (nurse.isVerified === false) {
      // return res.status(401).json({ message: "Please verify your email." });
      return next(new ApiError(401, "Please verify your email."));
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, nurse.password);
    if (!isPasswordValid) {
      // return res.status(401).json({ message: "Invalid email or password." });
      return next(new ApiError(401, "Invalid email or password."));
    }

    // Create and send token
    const token = createToken(nurse._id.toString());

    logger.info(`User logged in: ${nurse.email}`);

    const { password: _pw, __v, ...patientData } = nurse.toObject() as any;

    return res.status(201).json({
      status: "success",
      message: "User logged in successfully",
      token,
      data: {
        patientData,
      },
    });
  } catch (err) {
    console.error("User login error:", err);
    // return res.status(500).json({ message: "An unexpected error occurred." });
    return next(new ApiError(500, "An unexpected error occurred."));
  }
};

//------------------Verify Account------------------///

export const verifyPatientAccount = async (
  req: Request<{}, {}, EmailVerificationInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = emailVerificationSchema.parse(req);

    // 2. Access the nested body
    const { email, role, token } = validated.body;

    if (role !== "PATIENT")
      return next(new ApiError(404, "We're only looking for patients"));

    // Patients verify via email
    let patient: any | null;
    patient = await Patient.findOne({ email });

    if (!patient) {
      return next(new ApiError(404, "User not found."));
    }

    const jwtKey = process.env.JWT_SECRETE_KEY;

    if (!jwtKey) {
      throw new Error(
        "JWT_SECRETE_KEY is not defined in the environment variables",
      );
    }

    try {
      jwt.verify(token, jwtKey);
    } catch (tokenErr) {
      console.error("Token verification failed:", tokenErr);
      return res.status(401).json({ message: "Invalid token." });
    }

    // Update user
    patient.isVerified = true;
    await patient.save();

    return res.status(200).json({ message: "Email successfully verified." });
  } catch (err) {
    console.error("User login error:", err);
    // return res.status(500).json({ message: "An unexpected error occurred." });
    return next(new ApiError(500, "An unexpected error occurred."));
  }
};

export const verifyDoctorAccount = async (
  req: Request<{}, {}, EmailVerificationInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = emailVerificationSchema.parse(req);

    // 2. Access the nested body
    const { email, role, token } = validated.body;

    if (role !== "DOCTOR")
      return next(new ApiError(404, "We're only looking for doctors"));

    // Patients verify via email
    let doctor: any | null;
    doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return next(new ApiError(404, "User not found."));
    }

    const jwtKey = process.env.JWT_SECRETE_KEY;

    if (!jwtKey) {
      throw new Error(
        "JWT_SECRETE_KEY is not defined in the environment variables",
      );
    }

    try {
      jwt.verify(token, jwtKey);
    } catch (tokenErr) {
      console.error("Token verification failed:", tokenErr);
      return res.status(401).json({ message: "Invalid token." });
    }

    // Update user
    doctor.isVerified = true;
    await doctor.save();

    return res.status(200).json({ message: "Email successfully verified." });
  } catch (err) {
    console.error("User login error:", err);
    // return res.status(500).json({ message: "An unexpected error occurred." });
    return next(new ApiError(500, "An unexpected error occurred."));
  }
};

export const verifyNurseAccount = async (
  req: Request<{}, {}, EmailVerificationInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = emailVerificationSchema.parse(req);

    // 2. Access the nested body
    const { email, role, token } = validated.body;

    if (role !== "NURSE")
      return next(new ApiError(404, "We're only looking for nurses"));

    // Patients verify via email
    let nurse: any | null;
    nurse = await Nurse.findOne({ email });

    if (!nurse) {
      return next(new ApiError(404, "User not found."));
    }

    const jwtKey = process.env.JWT_SECRETE_KEY;

    if (!jwtKey) {
      throw new Error(
        "JWT_SECRETE_KEY is not defined in the environment variables",
      );
    }

    try {
      jwt.verify(token, jwtKey);
    } catch (tokenErr) {
      console.error("Token verification failed:", tokenErr);
      return res.status(401).json({ message: "Invalid token." });
    }

    // Update user
    nurse.isVerified = true;
    await nurse.save();

    return res.status(200).json({ message: "Email successfully verified." });
  } catch (err) {
    console.error("User login error:", err);
    // return res.status(500).json({ message: "An unexpected error occurred." });
    return next(new ApiError(500, "An unexpected error occurred."));
  }
};

//------------------forgot Password------------------///

export const patientForgotPasswordLink = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = patientLoginSchema.parse(req);

    // 2. Access the nested body
    const { email, role } = validated.body;

    if (role !== "PATIENT")
      return next(new ApiError(404, "We're only looking for patients"));

    // Patients reset via email
    let patient: any | null;
    patient = await Patient.findOne({ email });

    if (!patient) {
      return next(new ApiError(404, "No account found with that email."));
    }

    // Create a temporary secret for the JWT
    const secret = process.env.JWT_SECRETE_KEY + patient.password;

    // Generate the Reset Token (expires in 15-20 minutes for security)
    const token = jwt.sign({ id: patient._id, email: patient.email }, secret, {
      expiresIn: "20m",
    });

    // Create the Link
    const baseUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "") || "";
    const resetUrl = `${baseUrl}/auth/reset-password/${patient._id}/${token}`;

    //sending email
    sendForgotPassowrdLinkEmail(resetUrl, patient);

    res
      .status(200)
      .json({ success: true, message: "Reset link sent to email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    // res.status(500).json({ message: "Internal server error." });
    return next(new ApiError(500, "Internal server error."));
  }
};

export const doctorForgotPasswordLink = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = patientLoginSchema.parse(req);

    // 2. Access the nested body
    const { email, role } = validated.body;

    if (role !== "DOCTOR")
      return next(new ApiError(404, "We're only looking for doctors"));

    // Patients reset via email
    let doctor: any | null;
    doctor = await Patient.findOne({ email });

    if (!doctor) {
      return next(new ApiError(404, "No account found with that email."));
    }

    // Create a temporary secret for the JWT
    const secret = process.env.JWT_SECRETE_KEY + doctor.password;

    // Generate the Reset Token (expires in 15-20 minutes for security)
    const token = jwt.sign({ id: doctor._id, email: doctor.email }, secret, {
      expiresIn: "20m",
    });

    // Create the Link
    const baseUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "") || "";
    const resetUrl = `${baseUrl}/auth/reset-password/${doctor._id}/${token}`;

    //sending email
    sendForgotPassowrdLinkEmail(resetUrl, doctor);

    res
      .status(200)
      .json({ success: true, message: "Reset link sent to email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    // res.status(500).json({ message: "Internal server error." });
    return next(new ApiError(500, "Internal server error."));
  }
};

export const nurseForgotPasswordLink = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = patientLoginSchema.parse(req);

    // 2. Access the nested body
    const { email, role } = validated.body;

    if (role !== "NURSE")
      return next(new ApiError(404, "We're only looking for nurse"));

    // Patients reset via email
    let nurse: any | null;
    nurse = await Patient.findOne({ email });

    if (!nurse) {
      return next(new ApiError(404, "No account found with that email."));
    }

    // Create a temporary secret for the JWT
    const secret = process.env.JWT_SECRETE_KEY + nurse.password;

    // Generate the Reset Token (expires in 15-20 minutes for security)
    const token = jwt.sign({ id: nurse._id, email: nurse.email }, secret, {
      expiresIn: "20m",
    });

    // Create the Link
    const baseUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "") || "";
    const resetUrl = `${baseUrl}/auth/reset-password/${nurse._id}/${token}`;

    //sending email
    sendForgotPassowrdLinkEmail(resetUrl, nurse);

    res
      .status(200)
      .json({ success: true, message: "Reset link sent to email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    // res.status(500).json({ message: "Internal server error." });
    return next(new ApiError(500, "Internal server error."));
  }
};

//------------------reset Password------------------///

export const patientResetPassword = async (
  req: Request<{}, {}, ResetPasswordinInput, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = resetPasswordSchema.parse(req);

    const { password, id, token, role } = validated.body;

    if (role !== "PATIENT")
      return next(new ApiError(404, "We're only looking for patients"));

    // Find User & Reconstruct Dynamic Secret
    let patient: any | null;
    patient = await Patient.findById(id);

    if (!patient)
      return next(new ApiError(404, "User not found or email mismatch."));

    // Secret must match exactly what was used in forgotPasswordLink
    const secret = process.env.JWT_SECRETE_KEY + patient.password;

    // Verify JWT
    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired reset link." });
    }

    // Update Password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    patient.password = hashedPassword;

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    // res.status(500).json({ message: "Internal server error." });
    return next(new ApiError(500, "Internal server error."));
  }
};

export const doctorResetPassword = async (
  req: Request<{}, {}, ResetPasswordinInput, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = resetPasswordSchema.parse(req);

    const { password, id, token, role } = validated.body;

    if (role !== "DOCTOR")
      return next(new ApiError(404, "We're only looking for doctor"));

    // Find User & Reconstruct Dynamic Secret
    let doctor: any | null;
    doctor = await Doctor.findById(id);

    if (!doctor)
      return next(new ApiError(404, "User not found or email mismatch."));

    // Secret must match exactly what was used in forgotPasswordLink
    const secret = process.env.JWT_SECRETE_KEY + doctor.password;

    // Verify JWT
    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired reset link." });
    }

    // Update Password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    doctor.password = hashedPassword;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    // res.status(500).json({ message: "Internal server error." });
    return next(new ApiError(500, "Internal server error."));
  }
};

export const nurseResetPassword = async (
  req: Request<{}, {}, ResetPasswordinInput, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validated = resetPasswordSchema.parse(req);

    const { password, id, token, role } = validated.body;

    if (role !== "NURSE")
      return next(new ApiError(404, "We're only looking for nurse"));

    // Find User & Reconstruct Dynamic Secret
    let nurse: any | null;
    nurse = await Nurse.findById(id);

    if (!nurse)
      return next(new ApiError(404, "User not found or email mismatch."));

    // Secret must match exactly what was used in forgotPasswordLink
    const secret = process.env.JWT_SECRETE_KEY + nurse.password;

    // Verify JWT
    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired reset link." });
    }

    // Update Password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    nurse.password = hashedPassword;

    await nurse.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    // res.status(500).json({ message: "Internal server error." });
    return next(new ApiError(500, "Internal server error."));
  }
};
