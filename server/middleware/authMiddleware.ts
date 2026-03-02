import express from "express"; // Runtime engine
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// 1. Separate the "Blueprints" (Types) so Node doesn't look for them at runtime
import type { Request, Response, NextFunction } from "express";
import type { UserPayload } from "../types/auth.type.js";

dotenv.config();

/**
 * We use 'express.Request' to ensure the ESM linker doesn't break.
 * We use 'UserPayload' as a type-only import to avoid the "module not found" error.
 */
export const protect = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  let token: string | undefined;

  // 1. Extract Token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. If no token found
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // 3. Verify Token
    // Note: Ensure your .env matches JWT_SECRETE_KEY (with the 'E' at the end)
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRETE_KEY as string,
    ) as UserPayload;

    // 4. Attach user to request
    req.user = decoded;

    // 5. Move to the next middleware/controller
    return next();
  } catch (error: any) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
