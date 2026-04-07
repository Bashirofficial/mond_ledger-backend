import prisma from "../db/index.js";
import { Role } from "../generated/client/enums.js";

class UserRepository {
  findUniqueByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  findUniqueById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  create(
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string,
  ) {
    return prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: passwordHash,
      },
    });
  }

  updateRole(id: string, role: Role) {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  deactivate(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export default new UserRepository();
