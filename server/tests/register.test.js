import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import index from "../index.js";
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

describe("POST /auth/register", () => {
  it("should register a new user successfully", async () => {
    const res = await request(index).post("/auth/register").send({
      username: "siyabonga",
      email: "siyabonga@gmail.com",
      password: "Password-123",
      role: "doctor",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");

    const user = await userModel.findOne({ email: "siyabonga@gmail.com" });
    expect(user).not.toBeNull();
    expect(user.username).toBe("siyabonga");
  });

  it("should fail if email already exists", async () => {
    // create a user first
    await userModel.create({
      username: "Siyabonga",
      email: "test@example.com",
      password: "Password123!",
      role: "doctor",
    });

    const res = await request(index).post("/auth/register").send({
      username: "Siyabonga2",
      email: "test@example.com",
      password: "Password123!",
      role: "doctor",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Email already exists");
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(index).post("/auth/register").send({
      email: "missingfields@example.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });
});
