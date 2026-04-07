// src/routes/auditLog.route.ts
import { Router } from "express";
import { getAuditLogs } from "../controllers/auditLog.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { Role } from "../generated/client/enums.js";

const router = Router();

router.use(authenticate);

router.get("/", requireRole(Role.ADMIN), getAuditLogs);

export default router;
