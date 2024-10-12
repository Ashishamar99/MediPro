import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export const logRequestMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  logger.info({
    message: "HTTP Request",
    method: req.method,
    url: req.url,
    interactionId: req.get("interactionId") || "interactionId not found",
  });
  next();
};

export const logCaughtExceptionMiddleware = (
  error: any,
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  logger.error({
    message: "Internal server error",
    error: error.name,
    description: error.message,
    stack: error.stack,
    interactionId: req.get("interactionId") || "(INVALID INTERACTION ID)",
  });
  next();
};
