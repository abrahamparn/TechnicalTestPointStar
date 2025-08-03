import pino from "pino";
import { pinoHttp } from "pino-http";
import { AsyncLocalStorage } from "node:async_hooks";
import { v4 as uuid } from "uuid";
import { env } from "../../config/index.js";

const als = new AsyncLocalStorage();

export const logger = pino({
  // base logger
  transport:
    env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
  level: env.LOG_LEVEL,
  base: null, //omit pid/hostname
});

// http level logger with authomatic req/res serializers
export const httpLogger = pinoHttp({
  logger,
  genReqId: () => uuid(),
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";

    return "info";
  },
});

// middlaware to expose reqId in AsyncLocalStorage
export const requestContext = (req, _res, next) => {
  als.run(new Map([["reqId", req.id]]), next);
};

// helper so anything can fetch the current request Id
export const getReqId = () => als.getStore()?.get("reqId");
