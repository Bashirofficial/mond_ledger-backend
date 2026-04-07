import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import userService from "../services/user.service.js";

// -------- Controller Methods --------

const register = AsyncHandler(async (req: Request, res: Response) => {
  const data = await userService.register(req.body, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
        },
        tokens: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      },
      "User registered successfully",
    ),
  );
});

const login = AsyncHandler(async (req: Request, res: Response) => {
  const data = await userService.login(req.body.email, req.body.password);

  return res.json(
    new ApiResponse(
      200,
      {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
        },
        tokens: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      },
      "Login successful",
    ),
  );
});

const logout = AsyncHandler(async (req: Request, res: Response) => {
  await userService.logout(req.body.refreshToken);

  return res.json(new ApiResponse(200, {}, "Logout successful"));
});

const getUser = AsyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const user = await userService.getUserById(userId);

  return res.json(new ApiResponse(200, { user }, "User fetched successfully"));
});

const assignRole = AsyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id as string;

  const updated = await userService.assignRole(
    userId,
    req.body.role,
    req.user!,
    {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    },
  );

  return res.json(
    new ApiResponse(200, { updated }, "Role updated successfully"),
  );
});

const deactivateUser = AsyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  await userService.deactivateUser(userId, req.user!, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  return res.json(new ApiResponse(200, {}, "User deactivated successfully"));
});

const deleteUser = AsyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const updated = await userService.deleteUser(userId, req.user!, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  return res.json(
    new ApiResponse(200, { updated }, "User deleted successfully"),
  );
});

export {
  register,
  login,
  logout,
  getUser,
  assignRole,
  deactivateUser,
  deleteUser,
};
