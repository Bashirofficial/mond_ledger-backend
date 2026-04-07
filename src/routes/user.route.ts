import { Router } from "express";
import {
  register,
  login,
  logout,
  getUser,
  assignRole,
  deactivateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import { Role } from "../generated/client/enums.js";
import {
  registerSchema,
  loginSchema,
  logoutSchema,
  assignRoleSchema,
} from "../validators/user.validator.js";

const router = Router();

router.route("/register").post(validateRequest(registerSchema), register);
router.route("/login").post(validateRequest(loginSchema), login);
router
  .route("/logout")
  .post(authenticate, validateRequest(logoutSchema), logout);

router
  .route("/:id")
  .get(authenticate, getUser)
  .delete(authenticate, requireRole(Role.ADMIN), deleteUser);

router
  .route("/:id/deactivate")
  .patch(authenticate, requireRole(Role.ADMIN), deactivateUser);

router
  .route("/:id/assign-role")
  .patch(
    authenticate,
    requireRole(Role.ADMIN),
    validateRequest(assignRoleSchema),
    assignRole,
  );

export default router;
