import express from "express";
import { healthCheck } from "../../../infra/db/index.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const dbUp = await healthCheck();
  const status = dbUp ? 200 : 500;

  res.status(status).json({
    ok: dbUp,
    db: dbUp ? "up" : "down",
    uptime: process.uptime(),
    version: process.env.COMMIT_SHA || "dev",
  });
});

export { router as healthRouter };
