import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

// Middleware to validate request body, query, or params using Zod schemas
export const validateRequest = (
  schema: ZodObject<any>,
  source: "body" | "query" | "params" = "body",
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req[source]);

      Object.assign(req[source], validated);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        next(new ApiError(400, "Validation failed", errors));
      } else {
        next(error);
      }
    }
  };
};
