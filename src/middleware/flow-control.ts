import { NextFunction, Request, Response } from "express";

const { v4: uuidv4, validate: uuidValidate } = require("uuid");

export default function assignInteractionId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  let interactionId = req.get("interactionId");
  if (!interactionId) {
    interactionId = uuidv4();
    req.headers.interactionId = interactionId;
  }
  res.set({ interactionId });
  next();
}
