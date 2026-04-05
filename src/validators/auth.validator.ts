import { z } from "zod";

// ---------- REGISTER ----------
export const registerSchema = z.object({
  email: z.string().email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number",
    ),

  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
});

// ---------- LOGIN ----------
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// ---------- REFRESH TOKEN ----------
export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
