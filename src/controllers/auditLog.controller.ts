import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import auditLogService from "../services/auditLog.service.js";

const getAuditLogs = AsyncHandler(async (req: Request, res: Response) => {
  const logsData = await auditLogService.getLogs(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, logsData, "Audit logs retrieved successfully"));
});

export { getAuditLogs };
