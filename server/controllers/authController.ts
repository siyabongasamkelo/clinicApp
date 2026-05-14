import dotenv from "dotenv";
import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.services.ts";
dotenv.config();

export const registerLite = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const registrationData = req.body;
    await AuthService.registerAuthDetails(registrationData);

    res.status(201).json({
      message: "user registered successfully",
      status: "success",
    });
  } catch (error: any) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { identifier, password } = req.body;
    const response = await AuthService.executeLogin(identifier, password);

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
    await AuthService.getResetPasswordLink(email);

    res.json({
      message: "reset password email sent successfully",
      status: "success",
    });
  } catch (error: any) {
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

    res.json({
      message: "reset password email sent successfully",
      status: "success",
    });
  } catch (error: any) {
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
    await AuthService.verifyAccount(email, token);

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
    await AuthService.VerifyEmailRequest(email);

    res.json({
      message: "Verification link sent to email",
      status: "success",
    });
  } catch (error: any) {
    next(error);
  }
};
