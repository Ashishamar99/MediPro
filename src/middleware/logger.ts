import logger from "../utils/logger";

export const logRequestMiddleware = (req, _res, next) => {
  logger.info({
    message: "HTTP Request",
    method: req.method,
    url: req.url,
    headers: req.headers,
  });
  next();
};
