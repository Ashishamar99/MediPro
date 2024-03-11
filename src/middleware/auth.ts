// auth middleware
import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Status } from "../common/status";

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
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: Status.ERROR, message: "Unauthorized access" });
  }
};
