import prisma from "../db";
import { AuditAction, Prisma } from "../generated/client/client";

export interface AuditLogEntry {
  action: AuditAction;
  entityId: string;
  entity: string;
  performedById: string;
  beforeData?: Prisma.InputJsonValue;
  afterData?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
}

class AuditLogRepository {
  create(data: AuditLogEntry) {
    return prisma.auditLog.create({ data });
  }

  async findMany(page = 1, pageSize = 20, filters: any = {}) {
    const skip = (page - 1) * pageSize;

    const [logs, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where: filters,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          performedBy: { select: { firstName: true, email: true } },
        },
      }),
      prisma.auditLog.count({ where: filters }),
    ]);

    return {
      logs,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}

export default new AuditLogRepository();
