import { NextFunction } from "express";

const { v4: uuidv4, validate: uuidValidate } = require("uuid");

export default function assignInteractionId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  let interactionId = req.headers.get("interactionId");
  if (!interactionId) {
    interactionId = uuidv4();
    req.headers.set("interactionId", interactionId as string);
  }

  res.headers.set("interactionId", interactionId as string);
  next();
}
