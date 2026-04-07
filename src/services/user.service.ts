import userRepo from "../repository/user.repository.js";
import auditRepo from "../repository/auditLog.repository.js";
import { hashPassword, comparePassword } from "../utils/hash.util.js";
import { AuditAction, Role } from "../generated/client/enums.js";
import { ApiError } from "../utils/ApiError.js";
import {
  generateAccessAndRefreshToken,
  revokeRefreshToken,
} from "./auth.service.js";

class UserService {
  // -------- REGISTER --------
  async register(data: any, meta: any) {
    const { firstName, lastName, email, password } = data;

    const existing = await userRepo.findUniqueByEmail(email);
    if (existing) {
      throw new ApiError(409, "User already exists");
    }

    const passwordHash = await hashPassword(password);

    const user = await userRepo.create(
      firstName,
      lastName,
      email,
      passwordHash,
    );

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user.id,
    );
    return { user, accessToken, refreshToken };
  }

  // -------- LOGIN --------
  async login(email: string, password: string) {
    const user = await userRepo.findUniqueByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Your account has been deactivated.");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user.id,
    );

    return { user, accessToken, refreshToken };
  }

  // -------- LOGOUT --------
  async logout(refreshToken: string) {
    await revokeRefreshToken(refreshToken);
  }

  // -------- ASSIGN ROLE --------
  async assignRole(userId: string, role: Role, currentUser: any, meta: any) {
    const existing = await userRepo.findUniqueById(userId);
    if (!existing) {
      throw new ApiError(404, "User not found");
    }

    const updated = await userRepo.updateRole(userId, role);

    await auditRepo.create({
      action: AuditAction.ROLE_CHANGE,
      entity: "User",
      entityId: userId,
      performedById: currentUser.id,
      beforeData: existing,
      afterData: updated,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    });

    return updated;
  }

  // -------- DEACTIVATE USER --------
  async deactivateUser(userId: string, currentUser: any, meta: any) {
    const existing = await userRepo.findUniqueById(userId);
    if (!existing) {
      throw new ApiError(404, "User not found");
    }

    const updated = await userRepo.deactivate(userId);

    await auditRepo.create({
      action: AuditAction.UPDATE,
      entity: "User",
      entityId: userId,
      performedById: currentUser.id,
      beforeData: existing,
      afterData: updated,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    });

    return updated;
  }

  // -------- GET USER --------
  async getUserById(userId: string) {
    const user = await userRepo.findUniqueById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  // -------- DELETE USER (SOFT DELETE) --------
  async deleteUser(userId: string, currentUser: any, meta: any) {
    const existing = await userRepo.findUniqueById(userId);
    if (!existing) {
      throw new ApiError(404, "User not found");
    }

    const updated = await userRepo.softDelete(userId);

    await auditRepo.create({
      action: AuditAction.DELETE,
      entity: "User",
      entityId: userId,
      performedById: currentUser.id,
      beforeData: existing,
      afterData: updated,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    });

    return updated;
  }
}

export default new UserService();
