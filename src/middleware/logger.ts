import logger from "../utils/logger";

export const logRequestMiddleware = (req, _res, next) => {
  logger.info({
    message: "HTTP Request",
    method: req.method,
    url: req.url,
    interactionId: req.headers.interactionid || "interactionId not found",
  });
  next();
};

export const logCaughtExceptionMiddleware = (error, req, _res, next) => {
  logger.error({
    message: "Internal server error",
    error: error.name,
    description: error.message,
    stack: error.stack,
    interactionId: req.headers.interactionid || "interactionId not found",
  });
  next();
};
