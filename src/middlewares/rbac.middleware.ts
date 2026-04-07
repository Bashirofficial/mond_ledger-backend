import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Role } from "../generated/client/enums.js";

// Role hierarchy — higher index = more permissions
// ADMIN > ANALYST > VIEWER
const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.VIEWER]: 0,
  [Role.ANALYST]: 1,
  [Role.ADMIN]: 2,
};

export const requireRole = (...roles: Role[]) => {
  return AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new ApiError(
          401,
          "Unauthorized: No user information found in request.",
        );
      }

      const userRole = req.user.role;

      if (!roles.includes(userRole)) {
        throw new ApiError(
          403,
          `This action requires one of the following roles: ${roles.join(", ")}. Your role: ${userRole}`,
        );
      }

      next();
    },
  );
};

export const requireMinRole = (minimumRole: Role) => {
  return AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new ApiError(
          401,
          "Unauthorized: No user information found in request.",
        );
      }

      const userLevel = ROLE_HIERARCHY[req.user.role as Role];
      const requiredLevel = ROLE_HIERARCHY[minimumRole];

      if (userLevel < requiredLevel) {
        throw new ApiError(
          403,
          `This action requires at least ${minimumRole} role. Your role: ${req.user.role}`,
        );
      }

      next();
    },
  );
};

export const requireOwnerOrAdmin = (getUserId: (req: Request) => string) => {
  return AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new ApiError(
          401,
          "Unauthorized: No user information found in request.",
        );
      }

      const resourceOwnerId = getUserId(req);
      const isOwner = req.user.id === resourceOwnerId;
      const isAdmin = req.user.role === Role.ADMIN;

      if (!isOwner && !isAdmin) {
        throw new ApiError(
          403,
          "This action requires ownership of the resource or admin privileges.",
        );
      }

      next();
    },
  );
};
