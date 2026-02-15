import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { cloudinary } from "../utils/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";

dotenv.config();

const createToken = (id) => {
  const jwtKey = process.env.JWT_SECRETE_KEY;
  return jwt.sign({ id }, jwtKey, { expiresIn: "3d" });
};

const createTemporalyToken = (id) => {
  const jwtKey = process.env.JWT_SECRETE_KEY;
  return jwt.sign({ id }, jwtKey, { expiresIn: "15m" });
};

const verifyAndCompareUserId = (token, userId) => {
  try {
    const jwtKey = process.env.JWT_SECRETE_KEY;
    const decodedToken = jwt.verify(token, jwtKey);
    const userIdFromToken = decodedToken.id;

    const tokenExpiry = decodedToken.exp;
    if (Date.now() >= tokenExpiry * 1000)
      return { valid: false, message: "Token has expired" };

    if (userIdFromToken === userId)
      return {
        valid: true,
        message: "Token is valid for the specified user",
      };

    if (userIdFromToken !== userId)
      return {
        valid: false,
        message: "Token does not match the specified user",
      };
  } catch (error) {
    return {
      valid: false,
      message: "Error verifying token: " + error.message,
    };
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, password, username, role } = req.body || {};

    // Safely access the temp file path if available
    const photoFilePath =
      req?.files?.file?.tempFilePath ||
      req?.files?.photo?.tempFilePath ||
      req?.files?.profilePhoto?.tempFilePath;

    // Basic required fields validation
    if (
      !username?.trim() ||
      !email?.trim() ||
      !password ||
      !role?.trim() ||
      !photoFilePath
    ) {
      return res.status(422).json({ message: "Please fill all the fields" });
    }

    // Normalize values
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(422).json({ message: "Please enter a valid email" });
    }

    // You can adjust strong password options as needed
    if (!validator.isStrongPassword(password)) {
      return res
        .status(422)
        .json({ message: "Please enter a stronger password" });
    }

    // Optional: Validate role against an allow-list
    const allowedRoles = ["doctor", "admin", "nurse"];
    if (!allowedRoles.includes(role)) {
      return res.status(422).json({ message: "Invalid role" });
    }

    // Ensure uniqueness
    const userExists = await userModel.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    let imageLink;
    try {
      const imageUpload = await cloudinary.uploader.upload(photoFilePath);
      imageLink = imageUpload?.secure_url;
      if (!imageLink) {
        return res
          .status(500)
          .json({ message: "Failed to obtain uploaded image URL" });
      }
    } catch (uploadErr) {
      console.error("Cloudinary upload error:", uploadErr);
      return res
        .status(500)
        .json({ message: "An error occurred while uploading your photo" });
    }

    // Create user
    const createdUser = await userModel.create({
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
      profilePhoto: imageLink,
      role: role.trim(),
    });

    //create Token
    const newToken = createToken(createdUser._id);

    // Return minimal safe user info
    return res.status(201).json({
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
  } catch (err) {
    console.error("registerUser error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err?.message });
  }
};

const verifyEmailRequest = async (req, res) => {
  try {
    const { email } = req.body || {};

    // Validate input presence
    if (typeof email !== "string" || !email.trim()) {
      return res.status(422).json({ message: "Please provide your email." });
    }

    // Normalize and validate email
    const normalizedEmail = email.trim().toLowerCase();
    if (!validator.isEmail(normalizedEmail)) {
      return res.status(422).json({ message: "Please provide a valid email." });
    }

    // Look up the user
    const user = await userModel.findOne({ email: normalizedEmail });

    // If you prefer to avoid user enumeration, do not reveal existence
    if (!user) {
      // Still respond 200 to avoid leaking existence
      return res.status(200).json({
        message:
          "If an account exists for this email, a verification link has been sent.",
      });
    }

    // Create a token for verification (subject is the found user's id)
    const token = createToken(user._id);

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
      return res.status(502).json({
        message:
          "We couldn't send the verification email. Please try again later.",
      });
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

export { registerUser, verifyEmailRequest, createToken };
