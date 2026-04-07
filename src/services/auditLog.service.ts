import auditLogRepo, {
  AuditLogEntry,
} from "../repository/auditLog.repository.js";

class AuditLogService {
  async recordLog(entry: AuditLogEntry) {
    return await auditLogRepo.create(entry);
  }

  async getLogs(query: any) {
    const { page, limit, entity, entityId, performedById } = query;

    const filters: any = {};
    if (entity) filters.entity = entity;
    if (entityId) filters.entityId = entityId;
    if (performedById) filters.performedById = performedById;

    return await auditLogRepo.findMany(
      Number(page) || 1,
      Number(limit) || 20,
      filters,
    );
  }
}

export default new AuditLogService();
