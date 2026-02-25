import { jest } from "@jest/globals";

// Mock ONLY what we need
jest.unstable_mockModule("../models/userModel.js", () => ({
  userModel: {
    findOne: jest.fn(),
  },
}));

// Import AFTER mocking
const { verifyEmailRequest } = await import("../controllers/authController.js");
const { userModel } = await import("../models/userModel.js");

// const next = jest.fn();

describe("verifyEmailRequest", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { body: {} };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // ✅ 1. No email provided
  it("should return 422 if email is missing", async () => {
    await verifyEmailRequest(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 422,
      }),
    );

    const errorSentToNext = next.mock.calls[0][0];

    expect(errorSentToNext.statusCode).toBe(422);
    expect(errorSentToNext.message).toContain("Please provide your email.");

    //old code
    // expect(res.status).toHaveBeenCalledWith(422);
  });

  // ✅ 2. Invalid email format
  it("should return 422 if email format is invalid", async () => {
    req.body.email = "notanemail";

    await verifyEmailRequest(req, res, next);

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
  });

  // ✅ 3. Email does not exist
  it("should return 200 if user does not exist", async () => {
    req.body.email = "test@example.com";

    userModel.findOne.mockResolvedValue(null);

    await verifyEmailRequest(req, res, next);

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
