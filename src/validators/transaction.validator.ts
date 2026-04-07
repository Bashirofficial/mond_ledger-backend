import { z } from "zod";

// ---------- CREATE ----------
export const createTransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),

  type: z.enum(["INCOME", "EXPENSE"]),

  categoryId: z.uuid("Invalid category ID"),

  description: z.string().max(255).optional(),

  date: z.coerce.date(),

  notes: z.string().max(1000).optional(),
});

// ---------- UPDATE ----------
export const updateTransactionSchema = createTransactionSchema.partial();

// ---------- FILTER ----------
export const transactionFilterSchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),

    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    categoryId: z.uuid().optional(),

    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.startDate <= data.endDate,
    { message: "startDate must be before endDate" },
  );
