import express from "express";
import patientRouter from "./patient";
import doctorRouter from "./doctor";
import slotRouter from "./slot";
import consultationRouter from "./consultation";
import appointmentRouter from "./appointment";
import { auth } from "../middleware/auth";
import assignInteractionId from "../middleware/flow-control";
import {
  logCaughtExceptionMiddleware,
  logRequestMiddleware,
} from "../middleware/logger";

const router: any = express.Router();

router.use(assignInteractionId);

router.use(logRequestMiddleware);

router.use("/patient", patientRouter);

router.use("/doctor", doctorRouter);

router.use("/slot", auth, slotRouter);

router.use("/consultation", auth, consultationRouter);

router.use("/appointment", auth, appointmentRouter);

router.use(logCaughtExceptionMiddleware);

export default router;
