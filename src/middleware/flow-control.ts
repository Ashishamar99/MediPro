import { NextFunction, Request, Response } from "express";
import { INTERACTION_ID } from "../utils/constants";

const { v4: uuidv4, validate: uuidValidate } = require("uuid");

export default function assignInteractionId(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let interactionId = req.headers[INTERACTION_ID];
  if (!interactionId) {
    interactionId = uuidv4();
    req.headers[INTERACTION_ID] = interactionId;
  }
  res.set({ [INTERACTION_ID]: interactionId });
  next();
}
