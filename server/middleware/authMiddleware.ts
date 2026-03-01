import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token;

  // 1. Extract Token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. If no token found, stop immediately
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // 3. Verify Token (Synchronous style for cleaner flow)
    // DOUBLE CHECK: Is it JWT_SECRETE_KEY or JWT_SECRET_KEY in your .env?
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
