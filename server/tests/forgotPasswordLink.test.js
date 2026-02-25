import { jest } from "@jest/globals";

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

jest.unstable_mockModule("../utils/sendEmail.js", () => ({
  default: jest.fn(),
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: { sign: jest.fn() },
}));

const next = jest.fn();

// 2. Dynamically import the controller and the mocked modules
const { forgotPasswordLink } = await import("../controllers/authController.js");
const { userModel } = await import("../models/userModel.js");
const { default: sendEmail } = await import("../utils/sendEmail.js");
const { default: jwt } = await import("jsonwebtoken");
userModel.findOne.mockResolvedValue(null);
describe("forgotPasswordLink Controller", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    process.env.JWT_SECRETE_KEY = "testsecret";
  });

  // Test Case 1: Missing Email
  test("should return 400 if email is missing", async () => {
    req.body = {}; // No email

    await forgotPasswordLink(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
      }),
    );

    const errorSentToNext = next.mock.calls[0][0];

    expect(errorSentToNext.statusCode).toBe(400);
    expect(errorSentToNext.message).toContain("Email is required.");

    //old code
    // expect(res.status).toHaveBeenCalledWith(400);
    // expect(res.json).toHaveBeenCalledWith({ message: "Email is required." });
  }, 50000);

  // Test Case 2: Invalid Email Format
  test("should return 422 if email format is invalid", async () => {
    req.body = { email: "not-an-email" };

    await forgotPasswordLink(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 422,
      }),
    );

    const errorSentToNext = next.mock.calls[0][0];

    expect(errorSentToNext.statusCode).toBe(422);
    expect(errorSentToNext.message).toContain("Please provide a valid email.");

    //old code
    // expect(res.status).toHaveBeenCalledWith(422);
    // expect(res.json).toHaveBeenCalledWith({
    //   message: "Please provide a valid email.",
    // });
  });

  // Test Case 3: User Not Found
  test("should return 404 if user does not exist", async () => {
    req.body = { email: "stranger@example.com" };

    // Mock userModel.findOne to return null
    userModel.findOne.mockResolvedValue(null);

    await forgotPasswordLink(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
      }),
    );

    const errorSentToNext = next.mock.calls[0][0];

    expect(errorSentToNext.statusCode).toBe(404);
    expect(errorSentToNext.message).toContain(
      "No account found with that email.",
    );

    //old code
    // expect(res.status).toHaveBeenCalledWith(404);
    // expect(res.json).toHaveBeenCalledWith({
    //   message: "No account found with that email.",
    // });
  }, 50000);

  // Test Case 4: Success Scenario
  test("should send email successfully", async () => {
    const mockUser = { _id: "123", email: "test@me.com", password: "hash" };
    req.body = { email: "test@me.com" };

    // Set up the mock behaviors
    userModel.findOne.mockResolvedValue(mockUser);
    jwt.sign.mockReturnValue("mock-token");
    sendEmail.mockResolvedValue({ messageId: "sent" });

    await forgotPasswordLink(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(sendEmail).toHaveBeenCalled();
  });
});
