import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { env } from "./config/index.js";
import { httpLogger, requestContext } from "./infra/logger/index.js";
import { disconnect as dbDisconnect } from "./infra/db/index.js";

// Developing purposes
import { healthRouter } from "./api/v1/system/health.router.js";

// di container
import container from "./container.js";
import { AppError } from "./core/errors/appError.js";

// Features
import { authRouter } from "./api/v1/auth/auth.router.js";
import { noteRouter } from "./api/v1/note/note.router.js";

// Express app
const app = express();

app.use(httpLogger); //must come before all other middleware
app.use(requestContext);
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173", // no '*'
    credentials: true, // allow cookies
  })
);
app.use(bodyParser.json({ limit: "1mb" })); // change as we go // change thisto more than one lateron
app.use(cookieParser());

// DI Middleware
app.use((req, res, next) => {
  req.scope = container.createScope();
  next();
});
// Routes
app.use("/api/v1/healthz", healthRouter);

// Features
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/note", noteRouter);

// use data in front end
const staticDir = path.resolve(__dirname, "./../public");
console.log("staticDir", staticDir);
app.use(express.static(staticDir));

// SPA fallback for React Router:
app.get(/^\/(?!api(?:\/|$)).*/, (req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

// 404 and error handlers
app.use((_req, res, next) => next(new AppError("Not Found", 404)));

app.use((err, req, res, _next) => {
  const detail = err.details ? err.details : ""; //! Validate this later

  if (err.isOperational) {
    req.log.warn({ err }, "Operational error occurred");
    return res.status(err.statusCode).json({ success: false, error: err.message, details: detail });
  }

  req.log.error({ err }, "An unexpected error occurred!");
  res.status(500).json({ success: false, error: "Internal Server Error", details: detail });
});

const server = app.listen(env.PORT, () => {
  container.resolve("logger").info(`Server up on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

function shutdown(signal) {
  container.resolve("logger").info(`${signal} received, shutting down`);

  server.close(async () => {
    await dbDisconnect();
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown); //Signal Interrupt
process.on("SIGINT", shutdown); //Signal Terminate

export { app, server };
