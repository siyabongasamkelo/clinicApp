import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.js";
import type { Request, Response, NextFunction } from "express";
// import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repository/authRepository.ts";
import { AuthAdapter } from "../adapters/authAdaptor.ts";
import { AuthService } from "../services/auth.services.ts";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

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

export const registerLite = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const registrationData = req.body;

    const newUser = await AuthService.registerAuthDetails(registrationData);

    if (!newUser)
      return next(new ApiError(501, "Error occured while registering user"));

    if (newUser === "User with this email already exists")
      return next(new ApiError(409, "User already exists"));
    // 3. Adapt the result (Data Transformation)
    // const response = AuthAdapter.toRegisterResponse(newUser);

    logger.info(`User created successfully : ${newUser.newUser.identifier}`);
    res.status(201).json({
      message:
        "user registered successfully and verification email was sent to your email address",
      status: "success",
    });
  } catch (error: any) {
    next(error);
  }
};

// controllers/auth.controller.ts
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { identifier, password } = req.body;

    // 1. Ask the Service to do the "work"
    const result = await AuthService.executeLogin(identifier, password);

    if (!result) {
      logger.info(`Couldn't log user in : ${identifier}`);
      return next(new ApiError(401, "Couldn't log user"));
    }

    if (!result) {
      // return res.status(401).json({ message: "Invalid credentials", status: "fail" });
      return next(new ApiError(401, "Invalid credentials"));
    }

    // 2. Use the Adapter to shape the data for Vite
    const response = AuthAdapter.toLoginResponse(
      result.user,
      result.profile,
      result.token,
    );

    logger.info(`User logged in : ${result.user.identifier}`);
    res.json({ response, message: "login successful", status: "success" });
  } catch (error: any) {
    next(error);
  }
};

export const getResetPasswordLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    console.log("email", email);
    const getLink = await AuthService.getResetPasswordLink(email);

    if (!getLink) {
      // return res.status(401).json({ message: "Invalid credentials", status: "fail" });
      return next(new ApiError(500, "Internal server error"));
    }

    if (getLink === "user does not exist") {
      return next(new ApiError(404, "User with these email does not exist"));
    }

    if (getLink === "couldn't send email") {
      return next(new ApiError(500, "Internal server error"));
    }

    // 2. Use the Adapter to shape the data for Vite

    logger.info(`Reset Password Link sent successfully to : ${email}`);
    res.json({
      message: "reset password email sent successfully",
      status: "success",
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, id, token } = req.body;

    const resetPassword = await AuthService.resetPassword(password, id, token);

    if (!resetPassword) {
      // return res.status(401).json({ message: "Invalid credentials", status: "fail" });
      return next(new ApiError(500, "Internal server error"));
    }

    if (resetPassword === "No user")
      return next(new ApiError(500, "User does not exist"));
    if (resetPassword === "couldn't generate token")
      return next(new ApiError(500, "Internal server error"));
    if (resetPassword === "couldn't update password")
      return next(new ApiError(500, "couldn't update password"));

    logger.info(`Password reset successfully by user with this Id : ${id}`);
    res.json({
      message: "reset password email sent successfully",
      status: "success",
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const verifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, token } = req.body;

    const verifyAccount = await AuthService.verifyAccount(email, token);

    if (verifyAccount === "User with this email does not exist")
      return next(new ApiError(404, "User not found."));

    if (verifyAccount === "Token verification failed")
      return next(new ApiError(501, "Internal server error"));

    if (verifyAccount === "Error while verifying account")
      return next(new ApiError(501, "Internal server error"));

    logger.info(
      `Account verified successfully by user with this email : ${email}`,
    );
    res.json({
      message: "Account verified successfully",
      status: "success",
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const verifyEmailRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    const verifyEmail = await AuthService.VerifyEmailRequest(email);

    if (verifyEmail === "user does not exist")
      return next(new ApiError(404, "User not found."));

    if (verifyEmail === "couldn't generate token")
      return next(new ApiError(501, "Internal server error"));

    if (verifyEmail === "couldn't generate token")
      return next(new ApiError(501, "Internal server error"));

    res.json({
      message: "Verification link sent to email",
      status: "success",
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};
