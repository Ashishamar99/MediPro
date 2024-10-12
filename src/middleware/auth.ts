// auth middleware
import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Status } from "../common/status";
import logger from "../utils/logger";

export const auth = (
  req: Request,
  res: Response,
  next: NextFunction
): Response<void> | undefined => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];
  if (token == null) {
    return res
      .status(401)
      .json({ status: Status.ERROR, message: "Unauthorized access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");
    const { id } = decoded;
    if (id !== req.headers.id) {
      res.status(403).json({
        status: Status.FORBIDDEN,
        message: "You are not authorized to access this resource",
      });
      logger.error({
        message: `Invalid authorization request by user: ${decoded.id}, provided: ${req.headers.id}`,
      });
      return;
    }
    // @ts-ignore
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: Status.ERROR, message: "Unauthorized access" });
  }
};
