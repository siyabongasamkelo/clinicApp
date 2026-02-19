import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import index from "../index";
import { userModel } from "../models/userModel.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await userModel.deleteMany({});
});

const bcrypt = (await import("bcrypt")).default;

describe("POST /auth/reset-password/:id/:token", () => {
  const setupUser = async () => {
    try {
      const plainPassword = "OldPassword-123";

      console.log("Starting hash process...");
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      console.log("Bcrypt result:", hashedPassword); // Check if this is still undefined

      if (!hashedPassword) {
        throw new Error("Bcrypt returned undefined. Check your bcrypt import.");
      }

      const user = await userModel.create({
        username: "testuser",
        email: "test@example.com",
        password: hashedPassword,
        role: "doctor",
      });

      const secret =
        (process.env.JWT_SECRETE_KEY || "fallback_secret") + user.password;
      const token = jwt.sign({ id: user._id, email: user.email }, secret, {
        expiresIn: "20m",
      });

      return { user, token };
    } catch (error) {
      console.error("DETAILED SETUP ERROR:", error);
      throw error; // This will stop the test and show you the exact line that failed
    }
  };

  it("should successfully reset password with valid data", async () => {
    const { user, token } = await setupUser();

    const res = await request(index)
      .post(`/auth/reset-password/${user._id}/${token}`) // Match your route params
      .send({
        email: "test@example.com",
        password: "NewStrongPassword-123!", // Must pass validator.isStrongPassword
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(
      "Password updated successfully. You can now log in.",
    );

    // Verify DB update
    const updatedUser = await userModel.findById(user._id);
    const isMatch = await bcrypt.compare(
      "NewStrongPassword-123!",
      updatedUser.password,
    );
    expect(isMatch).toBe(true);
  }, 50000);

  it("should fail if the token is invalid or tampered with", async () => {
    const { user } = await setupUser();
    const badToken = "this-is-not-a-real-token";

    const res = await request(index)
      .post(`/auth/reset-password/${user._id}/${badToken}`)
      .send({
        email: "test@example.com",
        password: "NewStrongPassword-123!",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid or expired reset link.");
  }, 50000);

  it("should fail if the password is too weak", async () => {
    const { user, token } = await setupUser();

    const res = await request(index)
      .post(`/auth/reset-password/${user._id}/${token}`)
      .send({
        email: "test@example.com",
        password: "123", // Too weak
      });

    expect(res.statusCode).toBe(422);
    expect(res.body.message).toContain("Password is too weak");
  }, 50000);

  it("should fail if email is missing or incorrect", async () => {
    const { user, token } = await setupUser();

    const res = await request(index)
      .post(`/auth/reset-password/${user._id}/${token}`)
      .send({
        email: "wrong@email.com",
        password: "NewStrongPassword-123!",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found or email mismatch.");
  }, 50000);
});
