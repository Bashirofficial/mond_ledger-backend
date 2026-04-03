import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/hash.util";
import prisma from "../db";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { AsyncHandler } from "../utils/AsyncHandler";
import {
  generateAccessAndRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
} from "../services/auth.service";
import { success } from "zod";

//--------- Controllers (C) ---------//

// C1. Refresh Access Token using refreshToken
const refreshAccessToken = AsyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  try {
    const tokens = await rotateRefreshToken(refreshToken);

    
    return res
      .status(200)
      .json(new ApiResponse(200, tokens, "Tokens refreshed successfully"));
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    throw error;
  }
});

// C2. User Registration 
