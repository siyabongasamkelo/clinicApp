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

describe("verifyEmailRequest", () => {
  let req;
  let res;

  beforeEach(() => {
    req = { body: {} };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // ✅ 1. No email provided
  it("should return 422 if email is missing", async () => {
    await verifyEmailRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
  });

  // ✅ 2. Invalid email format
  it("should return 422 if email format is invalid", async () => {
    req.body.email = "notanemail";

    await verifyEmailRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
  });

  // ✅ 3. Email does not exist
  it("should return 200 if user does not exist", async () => {
    req.body.email = "test@example.com";

    userModel.findOne.mockResolvedValue(null);

    await verifyEmailRequest(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
