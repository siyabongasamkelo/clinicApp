import { jest } from "@jest/globals";

//Mock dependencies BEFORE importing the controller
await jest.unstable_mockModule("../models/userModel.js", () => ({
  userModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

await jest.unstable_mockModule("bcrypt", () => ({
  default: {
    compare: jest.fn(),
    hash: jest.fn(),
    genSalt: jest.fn(),
  },
}));

await jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn(() => "mock.jwt.token"),
    verify: jest.fn(),
  },
}));

// Now import the mocked modules and the controller
// const userModel = (await import("../models/userModel.js")).default;
const bcrypt = (await import("bcrypt")).default;
const jwt = (await import("jsonwebtoken")).default;

// Import controller as a module object to support both CJS and ESM export styles
const { loginUser } = await import("../controllers/authController.js");
const { userModel } = await import("../models/userModel.js");

if (typeof loginUser !== "function") {
  throw new Error(
    "loginUser was not found on the controller module. Ensure authController exports loginUser.",
  );
}

// Helper to mock req/res
const mockReqRes = (body = {}) => {
  const req = { body };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return { req, res };
};

const mockUserDoc = (overrides = {}) => ({
  _id: "507f191e810c19729de860ea",
  email: "user@example.com",
  password: "$2b$10$hashedpw",
  username: "TestUser",
  profilePhoto: null,
  role: "user",
  isVerified: true,
  toJSON() {
    return { _id: this._id, email: this.email, username: this.username };
  },
  ...overrides,
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("loginUser", () => {
  test("returns 422 when email is missing", async () => {
    const { req, res } = mockReqRes({ password: "password123" });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    const payload = res.json.mock.calls[0][0];
    const msg = payload?.message ?? payload?.error ?? "";
    expect(String(msg).toLowerCase()).toContain("email");
  });

  test("returns 422 when email is invalid format (if validated)", async () => {
    const { req, res } = mockReqRes({
      email: "not-an-email",
      password: "password123",
    });

    await loginUser(req, res);

    const statusCode = res.status.mock.calls[0]?.[0];
    expect(statusCode).toBe(422);

    const payload = res.json.mock.calls[0][0];
    const msg = payload?.message ?? payload?.error ?? "";
    expect(typeof msg).toBe("string");
  });

  test("returns 422 when password is missing or empty", async () => {
    const { req, res } = mockReqRes({
      email: "user@example.com",
      password: "",
    });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    const payload = res.json.mock.calls[0][0];
    const msg = payload?.message ?? payload?.error ?? "";
    expect(String(msg).toLowerCase()).toContain("password");
  });

  test("returns 404 when user does not exist", async () => {
    const { req, res } = mockReqRes({
      email: "nouser@example.com",
      password: "password123",
    });

    userModel.findOne.mockResolvedValueOnce(null);

    await loginUser(req, res);

    // Controller normalizes email to lowercase; keep expectation simple
    expect(userModel.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    const payload = res.json.mock.calls[0][0];
    const msg = payload?.message ?? payload?.error ?? "";
    expect(typeof msg).toBe("string");
  });

  test("returns 401 when password does not match", async () => {
    const { req, res } = mockReqRes({
      email: "user@example.com",
      password: "wrongpassword",
    });

    userModel.findOne.mockResolvedValueOnce(mockUserDoc());
    bcrypt.compare.mockResolvedValueOnce(false);

    await loginUser(req, res);

    expect(userModel.findOne).toHaveBeenCalled();
    expect(bcrypt.compare).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    const payload = res.json.mock.calls[0][0];
    const msg = payload?.message ?? payload?.error ?? "";
    expect(String(msg).toLowerCase()).toMatch(/invalid|incorrect|password/);
  });

  test("returns 201 and token on successful login", async () => {
    const { req, res } = mockReqRes({
      email: "user@example.com",
      password: "correctPassword",
    });

    const userDoc = mockUserDoc();
    userModel.findOne.mockResolvedValueOnce(userDoc);
    bcrypt.compare.mockResolvedValueOnce(true);
    jwt.sign.mockReturnValueOnce("mock.jwt.token");

    await loginUser(req, res);

    expect(userModel.findOne).toHaveBeenCalled();
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "correctPassword",
      userDoc.password,
    );

    // Controller sends 201 on success according to current implementation
    expect(res.status).toHaveBeenCalledWith(201);

    const payload = res.json.mock.calls[0][0];

    // Your controller responds with a nested user object and token inside user
    if (payload?.user?.token) {
      expect(payload.user).toEqual(
        expect.objectContaining({
          email: expect.any(String),
          token: expect.any(String),
        }),
      );
    } else {
      // If token is top-level
      expect(payload).toEqual(
        expect.objectContaining({ token: expect.any(String) }),
      );
    }
  });

  test("handles unexpected errors with 500", async () => {
    const { req, res } = mockReqRes({
      email: "user@example.com",
      password: "pw",
    });

    userModel.findOne.mockRejectedValueOnce(new Error("DB down"));

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    const payload = res.json.mock.calls[0][0];
    const msg = payload?.message ?? payload?.error ?? "";
    expect(typeof msg).toBe("string");
  });
});
