import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { cloudinary } from "../utils/cloudinary.js";

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

const verifyUser = async (req, res) => {
  try {
    const { email } = req.body;
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

export { registerUser };

const confirmEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json("Email is required");
    if (!validator.isEmail(email))
      return res.status(400).json("Please enter a valid email");

    const user = await userModel.find({ email: email });
    if (user.length > 0) return res.status(400).json("User already exits");

    const token = createTemporalyToken(email);

    const baseUrl = process.env.BASEURL || "http://localhost:3000";

    const link = `${baseUrl}/register/${email}/${token}`;

    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASSWORD}`,
      },
    });

    const options = {
      from: `${process.env.EMAIL}`,
      to: `${email}`,
      subject: "Impilo clinic app Confirmation Email",
      text: `Thank your for signing up on Impilo clinic app. Please confirm your email by clicking the link below ${link}`,
    };

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      }
      res.status(200).json("Check your email for further instructions");
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json("Please fill all the fields");

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json("Invalid email or password");

    const validity = await bcrypt.compare(password, user.password);
    if (!validity) return res.status(400).json("Wrong Password");

    const token = createToken(user._id);

    res
      .status(200)
      .json({ email, username: user.username, token, id: user._id });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(err);
    res.status(400).json(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findByIdAndDelete(userId);
    res.status(200).json("user deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, password, username } = req.body;

    //validation
    if (!userId) return res.status(400).json("user id is required");
    if (!username || !email || !password)
      return res.status(400).json("Please fill all the fields");

    if (!validator.isEmail(email))
      return res.status(400).json("Please enter a valid email");
    if (!validator.isStrongPassword(password))
      return res.status(400).json("Please enter a strong password");

    //hashing the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const update = { email, password: hashedPassword, username };
    const user = await userModel.findByIdAndUpdate(userId, update, {
      new: true,
    });
    res.status(200).json("user updated successfully");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json("Email is requred");
    if (!validator.isEmail(email))
      return res.status(400).json("Please enter a valid email");

    const user = await userModel.find({ email: email });

    if (!user) return res.status(400).json("User does not exits");

    const token = createTemporalyToken(user[0]?._id);

    const baseUrl = process.env.BASEURL || "http://localhost:3000";

    const link = `${baseUrl}/reset/${user[0]._id}/${token}`;

    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASSWORD}`,
      },
    });

    const options = {
      from: `${process.env.EMAIL}`,
      to: `${email}`,
      subject: "Impilo clinic app Watches Password reset",
      text: `To reset your password please click this link ${link}`,
    };

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      }
      res.status(200).json("Check your email for further instructions");
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userId, token } = req.params;
    const { email, password } = req.body;

    if (!email || !password || !userId || !token)
      return res.status(400).json("Please fill all the fields");

    if (!validator.isEmail(email))
      return res.status(400).json("Please enter a valid email");

    const user = await userModel.find({ email: email });

    if (!user) return res.status(400).json("user not found");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Please enter a strong password");

    const jwtKey = process.env.JWT_SECRETE_KEY;

    if (!token) return res.status(400).json("token is required");

    const verificationResult = verifyAndCompareUserId(token, userId);

    if (!verificationResult.valid)
      return res.status(400).json(verificationResult.message);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatePassword = await userModel.findOneAndUpdate(
      { _id: userId },
      { password: hashedPassword },
      {
        new: true,
      }
    );

    res.status(200).json("Password reset successfully");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

export {
  loginUser,
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  forgotPassword,
  resetPassword,
  confirmEmail,
};
