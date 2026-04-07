import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
} from "../controllers/category.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { Role } from "../generated/client/enums.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import { createCategorySchema } from "../validators/category.validator.js";

const router = Router();
router.use(authenticate);

router
  .route("/")
  .post(
    requireRole(Role.ADMIN),
    validateRequest(createCategorySchema),
    createCategory,
  )
  .get(getCategories);

router.route("/:id").get(getCategoryById);

export default router;
