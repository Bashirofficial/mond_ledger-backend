import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name too short").max(50, "Name too long"),
  description: z.string().max(255).optional(),
});
