import { jest } from "@jest/globals";

jest.unstable_mockModule("../models/userModel.js", () => ({
  userModel: {
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jest.fn(),
  },
}));

// 2. Load the mocked modules
const { userModel } = await import("../models/userModel.js");
const { default: jwt } = await import("jsonwebtoken");

// 3. Load the APP LAST (so it uses the mocks above)
const { default: app } = await import("../index.js");
import request from "supertest";

describe("GET /auth/confirmemail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 422 if email is missing", async () => {
    const res = await request(app).get("/auth/confirmemail?token=abc");

    expect(res.status).toBe(422);
    expect(res.body.message).toBe("Please provide your email.");
  }, 50000);

  it("should return 422 if token is missing", async () => {
    const res = await request(app).get(
      "/auth/confirmemail?email=test@example.com",
    );

    expect(res.status).toBe(422);
    expect(res.body.message).toBe("Please provide your token.");
  });

  it("should return 404 if user does not exist", async () => {
    userModel.findOne.mockResolvedValue(null);

    const res = await request(app).get(
      "/auth/confirmemail?email=test@example.com&token=abc",
    );

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found.");
  });

  it("should return 401 if token is invalid", async () => {
    userModel.findOne.mockResolvedValue({
      email: "test@example.com",
      isVerified: false,
      save: jest.fn(),
    });

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const res = await request(app).get(
      "/auth/confirmemail?email=test@example.com&token=badtoken",
    );

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid token.");
  });

  it("should verify user successfully if token is valid", async () => {
    const mockUser = {
      email: "test@example.com",
      isVerified: false,
      save: jest.fn().mockResolvedValue(true),
    };

    userModel.findOne.mockResolvedValue(mockUser);
    jwt.verify.mockReturnValue({ email: "test@example.com" });

    const res = await request(app).get(
      "/auth/confirmemail?email=test@example.com&token=validtoken",
    );

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Email successfully verified.");
    expect(mockUser.isVerified).toBe("true");
    expect(mockUser.save).toHaveBeenCalled();
  });
});
