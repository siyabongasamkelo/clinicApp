import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import index from "../index";
import { userModel } from "../models/userModel.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("POST /auth/register", () => {
  it("should register a new user with profile photo", async () => {
    const res = await request(index)
      .post("/auth/register")
      .field("username", "siyabonga")
      .field("email", "siyabonga@gmail.com")
      .field("password", "Password-123")
      .field("role", "doctor")
      .field("isVerified", "false")
      .attach(
        "file", // this must match the field name your server expects
        path.join(__dirname, "mockFiles/profile.jpg"), // path to a real image in your tests
      );

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User successfully registered");

    const user = await userModel.findOne({ email: "siyabonga@gmail.com" });
    expect(user).not.toBeNull();
    expect(user.username).toBe("siyabonga");
  }, 80000);
});

it("should fail if email already exists", async () => {
  // create a user first
  await userModel.create({
    username: "Siyabonga2",
    email: "test@example.com",
    password: "Password123!",
    role: "doctor",
    profilePhoto:
      "https://res.cloudinary.com/dly1tkadq/image/upload/v1771040876/f6ijdovh…",
    isVerified: "false",
  });

  const res = await request(index)
    .post("/auth/register")
    .field("username", "Siyabonga2")
    .field("email", "test@example.com")
    .field("password", "Password123!")
    .field("role", "doctor")
    .field("isVerified", "false")
    .attach(
      "file", // this must match the field name your server expects
      path.join(__dirname, "mockFiles/profile.jpg"), // path to a real image in your tests
    );

  expect(res.statusCode).toBe(409);
  expect(res.body).toHaveProperty("message", "Email already exists");
}, 50000);

it("should fail if required fields are missing", async () => {
  const res = await request(index).post("/auth/register").send({
    email: "missingfields@example.com",
  });

  expect(res.statusCode).toBe(422);
  expect(res.body).toHaveProperty("message", "Please fill all the fields");
}, 50000);
