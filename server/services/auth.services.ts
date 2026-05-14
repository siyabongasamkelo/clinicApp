// services/auth.service.ts
import { ProfileRepository } from "../repository/ProfileRepository.ts";
import { UserRepository } from "../repository/userRepository.ts";
import { AuthRepository } from "../repository/authRepository.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { UserLightRegisterSchema } from "../validation/auth.schema.ts";
import { AuthAdapter } from "../adapters/authAdaptor.ts";
import sendEmail from "../utils/sendEmail.js";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

// import { eventBus } from "../utils/eventBus";

dotenv.config();

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

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset your Clinic App Password",
      html: htmlContent,
      text: `Reset your password here: ${resetUrl}`,
    });
  } catch (err: unknown) {
    console.error("Email sending failed:", err);

    if (err instanceof Error) {
      logger.error(`Email sending failed: ${err?.message}`);
    } else {
      logger.error(`an unknown error occurred: ${String(err)}`);
    }

    return null;
  }
  return "success";
};

// services/auth.service.ts
export class AuthService {
  static async registerAuthDetails(
    registrationData: UserLightRegisterSchema["body"],
  ) {
    try {
      const userExists = await UserRepository.findByEmail(
        registrationData.email,
      );

      if (userExists) {
        logger.error(
          `User with this email already exists: ${registrationData.email}`,
        );
        throw new ApiError(409, "User with this already exists");
      }

      // 1. Validate User Data

      const newUser =
        await AuthRepository.createInitialAccount(registrationData);

      if (!newUser) {
        logger.error(
          `an error  occured while registering user with email: ${registrationData.email}`,
        );
        throw new ApiError(501, "error  occured while registering user");
      }

      // 3. Adapt the result (Data Transformation)
      const response = AuthAdapter.toRegisterResponse(newUser);

      if (!response) {
        logger.error(
          `an error  occured while formating response with authAdaptor for this user: ${registrationData.email}`,
        );
        throw new ApiError(501, "internal server error");
      }

      const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRETE_KEY!,
        { expiresIn: "1d" },
      );

      // 4. Send Email
      await sendVerificationEmail(newUser.email, token);

      logger.info(`User created successfully : ${newUser.identifier}`);

      return { response, newUser };
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error(`error while creating user: ${err.message}`);
      } else {
        logger.error(`an unknown error occurred: ${String(err)}`);
      }
      return null;
    }
  }

  static async executeLogin(identifier: string, pass: string) {
    // 1. Repo finds the Identity
    const user = await UserRepository.findByIdentifier(identifier);
    if (!user) {
      logger.info(`user with identifier : ${identifier} does not exist `);
      throw new ApiError(404, "user not found");
    }

    // 2. Logic: Check password
    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      logger.info(`incorrect email or password by user : ${identifier}`);
      throw new ApiError(401, "incorrect email or password");
    }

    // 3. Repo finds the Profile
    const profile = await ProfileRepository.getProfile(user.id, user.role);

    if (!profile) {
      logger.info(`Profile not found for user : ${identifier}`);
      throw new ApiError(501, "internal server error");
    }

    // 4. Logic: Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRETE_KEY!,
      { expiresIn: "1d" },
    );

    const response = AuthAdapter.toLoginResponse(user, profile, token);

    return { response };
  }

  static async getResetPasswordLink(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      logger.error(`user with email: ${email} does not exist`);
      throw new ApiError(404, "user with this email does not exist");
    }

    const secret = process.env.JWT_SECRETE_KEY + user.password;

    // Generate the Reset Token (expires in 15-20 minutes for security)
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "20m",
    });

    // Create the Link
    const baseUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "") || "";
    const resetUrl = `${baseUrl}/auth/reset-password/${user.id}/${token}`;

    // Send Email

    try {
      sendForgotPassowrdLinkEmail(resetUrl, user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error(
          `error while sending email to : ${email} , error ${err?.message}`,
        );
        throw new ApiError(501, "error while sending email");
      } else {
        logger.error(`an unknown error occurred: ${String(err)}`);
        throw new ApiError(501, "error while sending email");
      }

      return "couldn't send email";
    }

    return { message: "reset password link was sent to your email" };
  }

  static async verifyAccount(email: string, token: string) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      logger.error(`User with this email does not exist: ${email}`);
      throw new ApiError(404, "user not found");
    }

    const jwtKey = process.env.JWT_SECRETE_KEY!;

    try {
      jwt.verify(token, jwtKey);
    } catch (tokenErr) {
      logger.error(`Token verification failed: ${tokenErr}`);
      throw new ApiError(501, "internal server error");
    }

    const verifyAccount = await UserRepository.verifyAccount(user.id);

    if (!verifyAccount) {
      logger.error(`Error while verifying account: ${verifyAccount}`);
      throw new ApiError(501, "internal server error");
    }

    return { message: "Account verified successfully" };
  }

  static async resetPassword(password: string, id: string, token: string) {
    const user = await UserRepository.findById(id);
    if (!user) {
      logger.error(`user with id: ${id} does not exist`);
      throw new ApiError(404, "user with this email does not exist");
    }

    const secret = process.env.JWT_SECRETE_KEY + user.password;

    try {
      jwt.verify(token, secret);
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error(`Error while verifying token : ${err.message}`);
        throw new ApiError(500, "internal server error");
      } else {
        logger.error(`an unknown error occurred: ${String(err)}`);
        throw new ApiError(500, "internal server error");
      }
    }

    //updating password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const success = await UserRepository.updatePassword(id, hashedPassword);

      if (!success) {
        logger.error(`couldn't update password for this user ${id}`);
        throw new ApiError(500, "internal server error");
      }

      logger.info(`Password reset successfully by user with this Id : ${id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error(`Error while updating password : ${err.message}`);
        throw new ApiError(500, "internal server error");
      } else {
        logger.error(`an unknown error occurred: ${String(err)}`);
        throw new ApiError(500, "internal server error");
      }
    }

    return { message: "password was updated successfully" };
  }

  static async VerifyEmailRequest(email: string) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      logger.error(`user with email: ${email} does not exist`);
      throw new ApiError(404, "user with this email does not exist");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRETE_KEY!,
      { expiresIn: "1d" },
    );

    if (!token) {
      logger.error(
        `could not generate token: for user with this email:${email}`,
      );
      throw new ApiError(501, "Internal server error");
    }

    // 4. Send Email
    await sendVerificationEmail(user.email, token);

    return { message: "email verification link was sent to your email" };
  }
}
