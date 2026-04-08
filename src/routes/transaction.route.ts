import { Router } from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getDashboardData,
} from "../controllers/transaction.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireMinRole, requireRole } from "../middlewares/rbac.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import { Role } from "../generated/client/enums.js";
import {
  createTransactionSchema,
  transactionFilterSchema,
  updateTransactionSchema,
} from "../validators/transaction.validator.js";
import { userRateLimit } from "../middlewares/rateLimit.middleware.js";

const router = Router();
router.use(authenticate);

router
  .route("/")
  .post(
    userRateLimit,
    requireMinRole(Role.ADMIN),
    validateRequest(createTransactionSchema),
    createTransaction,
  )
  .get(
    userRateLimit,
    requireMinRole(Role.ADMIN),
    validateRequest(transactionFilterSchema, "query"),
    getTransactions,
  );

router
  .route("/:id")
  .patch(
    userRateLimit,
    requireRole(Role.ADMIN),
    validateRequest(updateTransactionSchema),
    updateTransaction,
  )
  .delete(requireRole(Role.ADMIN), deleteTransaction);

router.route("/dashboard").get(requireMinRole(Role.VIEWER), getDashboardData);

export default router;
