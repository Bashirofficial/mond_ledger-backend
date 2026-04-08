import { rateLimit as baseRateLimit, Options } from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";

// Rate limiter middleware which allow 100 requests per 15 minutes
export const createRateLimiter = (options?: Partial<Options>) => {
  return baseRateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100, // Note: 'max' is deprecated in newer versions for 'limit'
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false },

    keyGenerator: (req) => {
      const xRealIp = req.get("x-real-ip");
      const xForwardedFor = req.get("x-forwarded-for");

      // If x-forwarded-for is a list, take the first IP
      const firstForwardedIp = xForwardedFor?.split(",")[0].trim();

      return xRealIp || firstForwardedIp || req.ip || "unknown";
    },
    handler: (req, res, next) => {
      next(new ApiError(429, "Too many requests, please try again later"));
    },
    ...options,
  });
};

export const userRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
});
