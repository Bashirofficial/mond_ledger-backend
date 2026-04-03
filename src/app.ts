import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
 

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
 
// ================= Error Handling ================= 

export default app;
