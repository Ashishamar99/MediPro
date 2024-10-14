import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { INTERACTION_ID } from "../utils/constants";

export const logRequestMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.info({
    message: "HTTP Request",
    method: req.method,
    url: req.url,
    interactionId: req.headers[INTERACTION_ID] || "(INVALID INTERACTION ID)",
  });
  next();
};

export const logCaughtExceptionMiddleware = (
  error: any,
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.error({
    message: "Internal server error",
    error: error.name,
    description: error.message,
    stack: error.stack,
    interactionId: req.headers[INTERACTION_ID] || "(INVALID INTERACTION ID)",
  });
  next();
};
