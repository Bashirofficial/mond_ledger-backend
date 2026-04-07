import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.middleware.js";

const app: Application = express();

// ================= Security =================
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

// ================= BODY PARSING =================
app.use(express.json({ limit: "25kb" }));
app.use(express.urlencoded({ extended: true, limit: "25kb" }));

// ================= LOGGING =================
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ================= HEALTH CHECK =================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ================= Routes =================
import userRoutes from "./routes/user.route.js";
import categoryRoutes from "./routes/category.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import auditLogRoutes from "./routes/auditLog.rotue.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/audit-logs", auditLogRoutes);

// ================= Error Handling =================
app.use(notFoundHandler); // 404 handler - must be after all routes
app.use(errorHandler); // Global error handler - must be after all routes

export default app;
