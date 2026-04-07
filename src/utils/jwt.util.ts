import jwt, { SignOptions } from "jsonwebtoken";
import { ApiError } from "./ApiError.js";
import { env } from "../config/env.js";

export interface AccessPayload {
  userId: string;
}

export interface RefreshPayload {
  userId: string;
  tokenId: string; // matches RefreshToken.id in DB
}

export const generateAccessToken = (payload: AccessPayload) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: RefreshPayload) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string): AccessPayload => {
  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

    if (typeof decoded !== "object" || !decoded || !("userId" in decoded)) {
      throw new ApiError(401, "Invalid token payload");
    }

    return decoded as AccessPayload;
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token: string): RefreshPayload => {
  try {
    const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET);

    if (
      typeof decoded !== "object" ||
      !decoded ||
      !("userId" in decoded) ||
      !("tokenId" in decoded)
    ) {
      throw new ApiError(401, "Invalid refresh token payload");
    }

    return decoded as RefreshPayload;
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};
