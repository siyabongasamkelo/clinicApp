import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
// import logger from "../utils/logger.js";

// import { AnyZodObject, ZodError } from "zod";
import { type AnyZodObject, fromJSONSchema, ZodError } from "zod";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        files: req.files,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          // err.path will be ["body", "fullName"] -> we turn it into "body.fullName"
          field: err.path.join("."),
          // message: err.message,
          message: "all fields are required",
          status: "false",
        }));
        logger.error(
          `Error caught by Zod middleware because there are missing fields`,
        );

        return res.status(400).json({
          status: "fail",
          errors: formattedErrors,
        });
      }
      next(error);
    }
  };
