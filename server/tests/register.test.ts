import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import type { Application } from "express";

import path from "path";
import { fileURLToPath } from "url";
// import app from "../index"; // Ensure index exports 'app'
import app from "../index.js";
import { userModel } from "../models/userModel.js";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  jest,
} from "@jest/globals";

// Then, if you need the type in your file, use it like this:
// type User = mongoose.InferSchemaType<typeof userSchema>;

// 1. Mock Cloudinary using a plain JS function to avoid the 'as any' syntax error
jest.mock("cloudinary", () => {
  return {
    v2: {
      uploader: {
        // We define the mock function without TS casting here
        upload: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            secure_url: "https://res.cloudinary.com",
            public_id: "mock-id",
          });
        }),
      },
    },
  };
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Explicitly type the mongoServer
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  // Clean database between tests for isolation
  await userModel.deleteMany({});
  jest.clearAllMocks();
});

describe("POST /auth/register", () => {
  const mockUser = {
    username: "siyabonga",
    email: "siyabonga@gmail.com",
    password: "Password-123",
    role: "doctor",
  };

  it("should register a new user with profile photo", async () => {
    const res = await request(app as Application)
      .post("/auth/register")
      .field("username", mockUser.username)
      .field("email", mockUser.email)
      .field("password", mockUser.password)
      .field("role", mockUser.role)
      .field("isVerified", "false")
      .attach("file", path.join(__dirname, "mockFiles/profile.jpg"));

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User successfully registered");

    const user = await userModel.findOne({ email: mockUser.email });
    expect(user).not.toBeNull();
    // Non-null assertion for TS safety
    expect(user!.username).toBe(mockUser.username);
  }, 50000);

  it("should fail if email already exists", async () => {
    // Seed existing user
    await userModel.create({
      ...mockUser,
      profilePhoto: "https://mock-link.com",
      isVerified: "false",
    });

    const res = await request(app as Application)
      .post("/auth/register")
      .field("username", "DifferentName")
      .field("email", mockUser.email) // Same email
      .field("password", "Password123!")
      .field("role", "doctor")
      .attach("file", path.join(__dirname, "mockFiles/profile.jpg"));

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/exists/i);
  });

  it("should fail if required fields are missing", async () => {
    // Note: Multer expects multipart/form-data for .field()
    // but if no file is sent, ensure your backend handles empty bodies
    const res = await request(app as Application)
      .post("/auth/register")
      .send({ email: "missing@example.com" });

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty("message", "Please fill all the fields");
  });
});
