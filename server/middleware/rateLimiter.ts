import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 requests per windowMs
  message: {
    message:
      "Too many attempts from this IP, please try again after 15 minutes",
  },
  standardHeaders: "draft-7", // combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const generalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 100, // Limit each IP to 100 requests per hour
  message: {
    message: "You have reached your hourly request limit.",
  },
});
