import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.js";
import type {
  VerifyEmailRequestBody,
  VerifyEmailQuery,
  ForgotPasswordLinkBody,
  ResetPasswordBody,
  ResetPasswordParams,
  RegisterBody,
  LoginBody,
} from "../types/auth.type.js";
import type { NextFunction, Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import validator from "validator";
import bcrypt from "bcrypt";
import { userModel } from "../models/userModel.js";
import type { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

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

// const createTemporalyToken = (id) => {
//   const jwtKey = process.env.JWT_SECRETE_KEY;
//   return jwt.sign({ id }, jwtKey, { expiresIn: "15m" });
// };

// const verifyAndCompareUserId = (token, userId) => {
//   try {
//     const jwtKey = process.env.JWT_SECRETE_KEY;
//     const decodedToken = jwt.verify(token, jwtKey);
//     const userIdFromToken = decodedToken.id;

//     const tokenExpiry = decodedToken.exp;
//     if (Date.now() >= tokenExpiry * 1000)
//       return { valid: false, message: "Token has expired" };

//     if (userIdFromToken === userId)
//       return {
//         valid: true,
//         message: "Token is valid for the specified user",
//       };

//     if (userIdFromToken !== userId)
//       return {
//         valid: false,
//         message: "Token does not match the specified user",
//       };
//   } catch (error) {
//     return {
//       valid: false,
//       message: "Error verifying token: " + error.message,
//     };
//   }
// };

// actual routes controller functions

export const registerUser = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // 2. Change return type to void since middleware handles response
  try {
    const { email, password, username, role } = req.body;

    const files = req.files as any;
    const photoFile = files?.file || files?.photo || files?.profilePhoto;
    const photoFilePath = (photoFile as UploadedFile)?.tempFilePath;

    // 3. Instead of res.status().json(), use next(new ApiError())
    if (
      !username?.trim() ||
      !email?.trim() ||
      !password ||
      !role?.trim() ||
      !photoFilePath
    ) {
      return next(new ApiError(422, "Please fill all the fields"));
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!validator.isEmail(normalizedEmail)) {
      return next(new ApiError(422, "Please enter a valid email"));
    }

    if (!validator.isStrongPassword(password)) {
      return next(new ApiError(422, "Please enter a stronger password"));
    }

    const allowedRoles = ["doctor", "admin", "nurse"];
    if (!allowedRoles.includes(role)) {
      return next(new ApiError(422, "Invalid role"));
    }

    const userExists = await userModel.findOne({ email: normalizedEmail });
    if (userExists) {
      return next(new ApiError(409, "Email already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. No more nested try/catches! If it fails, catch(err) catches it.
    const imageLink = await uploadToCloudinary(photoFilePath, "profiles");

    const createdUser = await userModel.create({
      email: normalizedEmail,
      username: username.trim(),
      password: hashedPassword,
      profilePhoto: imageLink,
      role: role.trim(),
    });

    const newToken = createToken(createdUser._id.toString());

    // 5. Successful responses still use res.status()
    res.status(201).json({
      message: "User successfully registered",
      user: {
        id: createdUser._id,
        email: createdUser.email,
        username: createdUser.username,
        profilePhoto: createdUser.profilePhoto,
        role: createdUser.role,
        token: newToken,
        isVerified: "false",
      },
    });
  } catch (err: any) {
    // 6. The "Magic" - pass any unexpected error (DB crash, etc.) to the handler
    next(err);
  }
};

export const verifyEmailRequest = async (
  req: Request<{}, {}, VerifyEmailRequestBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body || {};

    // Validate input presence
    if (typeof email !== "string" || !email.trim()) {
      return next(new ApiError(422, "Please provide your email."));
    }

    // Normalize and validate email
    const normalizedEmail = email.trim().toLowerCase();
    if (!validator.isEmail(normalizedEmail)) {
      return next(new ApiError(422, "Please provide a valid email."));
    }

    // Look up the user
    let user: User | null;
    user = await userModel.findOne({ email: normalizedEmail });

    // If you prefer to avoid user enumeration, do not reveal existence
    if (!user) {
      // Still respond 200 to avoid leaking existence
      return res.status(200).json({
        message:
          "If an account exists for this email, a verification link has been sent.",
      });
    }

    // Create a token for verification (subject is the found user's id)
    const token = createToken(user._id.toString());

    // Build verification link
    const baseUrl = process.env.BASEURL?.replace(/\/+$/, "") || "";
    const verificationLink = `${baseUrl}/auth/confirmemail?email=${encodeURIComponent(
      normalizedEmail,
    )}&token=${encodeURIComponent(token)}`;

    // Send email
    try {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Account",
        html: `<h1>Welcome!</h1>
                 <p>Please verify your account by clicking the link below:</p>
                 <a href="${verificationLink}">Verify Account</a>`,
        text: `Please verify your account by visiting: ${verificationLink}`,
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      return next(
        new ApiError(
          502,
          "We couldn't send the verification email. Please try again later.",
        ),
      );
    }

    return res.status(200).json({
      message:
        "If an account exists for this email, a verification link has been sent.",
    });
  } catch (err) {
    console.error("verifyEmailRequest error:", err);
    return res.status(500).json({ message: "An unexpected error occurred." });
  }
};

export const verifyEmail = async (
  req: Request<{}, {}, {}, VerifyEmailQuery>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, token } = req.query || {};

    // Validate input presence
    if (typeof email !== "string" || !email.trim()) {
      return next(new ApiError(422, "Please provide your email."));
    }
    if (typeof token !== "string" || !token.trim()) {
      return next(new ApiError(422, "Please provide your token."));
    }

    // Normalize and validate email
    const normalizedEmail = email.trim().toLowerCase();
    if (!validator.isEmail(normalizedEmail)) {
      return next(new ApiError(422, "Please provide a valid email."));
    }

    // Look up the user
    let user: User | null;
    user = await userModel.findOne({ email: normalizedEmail });

    // If you prefer to avoid user enumeration, do not reveal existence
    if (!user) {
      return next(new ApiError(404, "User not found."));
    }

    // Verify token

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
    user.isVerified = "true";
    await user.save();

    return res.status(200).json({ message: "Email successfully verified." });
  } catch (err) {
    console.error("verifyEmail error:", err);
    return res.status(500).json({ message: "An unexpected error occurred." });
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body || {};

    // Validate input presence
    if (typeof email !== "string" || !email.trim()) {
      // return res.status(422).json({ message: "Please provide your email." });
      return next(new ApiError(422, "Please provide your email."));
    }
    if (typeof password !== "string" || !password.trim()) {
      // return res.status(422).json({ message: "Please provide your password." });
      return next(new ApiError(422, "Please provide your password."));
    }

    // Normalize and validate email
    const normalizedEmail = email.trim().toLowerCase();
    if (!validator.isEmail(normalizedEmail)) {
      // return res.status(422).json({ message: "Please provide a valid email." });
      return next(new ApiError(422, "Please provide a valid email."));
    }

    // Look up the user
    let user: User | null;
    user = await userModel.findOne({ email: normalizedEmail });

    // If you prefer to avoid user enumeration, do not reveal existence
    if (!user) {
      // return res.status(404).json({ message: "User not found." });
      return next(new ApiError(404, "User not found."));
    }

    if (user.isVerified === "false") {
      // return res.status(401).json({ message: "Please verify your email." });
      return next(new ApiError(401, "Please verify your email."));
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // return res.status(401).json({ message: "Invalid email or password." });
      return next(new ApiError(401, "Invalid email or password."));
    }

    // Create and send token
    const token = createToken(user._id.toString());

    logger.info(`User logged in: ${user.email}`);

    return res.status(201).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profilePhoto: user.profilePhoto,
        role: user.role,
        token: token,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("User login error:", err);
    // return res.status(500).json({ message: "An unexpected error occurred." });
    return next(new ApiError(500, "An unexpected error occurred."));
  }
};

export const forgotPasswordLink = async (
  req: Request<{}, {}, ForgotPasswordLinkBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;
    // Validate email input
    if (!email) {
      // return res.status(400).json({ message: "Email is required." });
      return next(new ApiError(400, "Email is required."));
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!validator.isEmail(normalizedEmail)) {
      // return res.status(422).json({ message: "Please provide a valid email." });
      return next(new ApiError(422, "Please provide a valid email."));
    }

    // Find user
    let user: User | null;
    user = await userModel.findOne({ normalizedEmail });

    if (!user) {
      // return res.status(404).json({ message: "No account found with that email." });
      return next(new ApiError(404, "No account found with that email."));
    }

    // Create a temporary secret for the JWT
    const secret = process.env.JWT_SECRETE_KEY + user.password;

    // Generate the Reset Token (expires in 15-20 minutes for security)
    const token = jwt.sign({ id: user._id, email: user.email }, secret, {
      expiresIn: "20m",
    });

    // Create the Link
    const baseUrl = process.env.BASEURL?.replace(/\/+$/, "") || "";
    const resetUrl = `${baseUrl}/auth/reset-password/${user._id}/${token}`;

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

    res
      .status(200)
      .json({ success: true, message: "Reset link sent to email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    // res.status(500).json({ message: "Internal server error." });
    return next(new ApiError(500, "Internal server error."));
  }
};

export const resetPassword = async (
  req: Request<ResetPasswordParams, {}, ResetPasswordBody, {}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id, token } = req.params;
  const { email, password } = req.body;

  try {
    // Basic Input Validation
    if (!email || !password || !token) {
      // return res.status(400).json({ message: "All fields are required." });
      return next(new ApiError(400, "All fields are required."));
    }

    // Email Format Validation
    const normalizedEmail = email.trim().toLowerCase();
    if (!validator.isEmail(normalizedEmail)) {
      // return res.status(422).json({ message: "Invalid email format." });
      return next(new ApiError(422, "Invalid email format."));
    }

    // Password Strength Check
    if (!validator.isStrongPassword(password)) {
      // return res.status(422).json({message:"Password is too weak. Must be 8+ chars with uppercase, lowercase, numbers, and symbols.",});
      return next(
        new ApiError(
          422,
          "Password is too weak. Must be 8+ chars with uppercase, lowercase, numbers, and symbols.",
        ),
      );
    }

    // Find User & Reconstruct Dynamic Secret
    let user: User | null;
    user = await userModel.findById(id);
    if (!user || user.email !== normalizedEmail) {
      // return res.status(404).json({ message: "User not found or email mismatch." });
      return next(new ApiError(404, "User not found or email mismatch."));
    }

    // Secret must match exactly what was used in forgotPasswordLink
    const secret = process.env.JWT_SECRETE_KEY + user.password;

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

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
