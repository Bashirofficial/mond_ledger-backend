import { Router } from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getDashboardData,
} from "../controllers/transaction.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import { Role } from "../generated/client/enums.js";
import {
  createTransactionSchema,
  transactionFilterSchema,
  updateTransactionSchema,
} from "../validators/transaction.validator.js";

const router = Router();
router.use(authenticate);

router
  .route("/")
  .post(
    requireRole(Role.ADMIN),
    validateRequest(createTransactionSchema),
    createTransaction,
  )
  .get(validateRequest(transactionFilterSchema, "query"), getTransactions);

router
  .route("/:id")
  .patch(
    requireRole(Role.ADMIN),
    validateRequest(updateTransactionSchema),
    updateTransaction,
  )
  .delete(requireRole(Role.ADMIN), deleteTransaction);

router
  .route("/dashboard")
  .get(requireRole(Role.ADMIN, Role.ANALYST), getDashboardData);

export default router;
