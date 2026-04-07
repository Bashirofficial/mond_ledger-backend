import { Request, Response, NextFunction } from "express";
import prisma from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.util.js";

export const authenticate = AsyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "Access token is required!");
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, "User not authorized");
    }

    req.user = user;

    next();
  },
);
