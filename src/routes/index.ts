import express from 'express';
import patientRouter from './patient';
import doctorRouter from './doctor';
import slotRouter from './slot';
import consultationRouter from './consultation';
import appointmentRouter from './appointment';
import { auth } from '../middleware/auth';
import assignInteractionId from '../middleware/flow-control';

const router = express.Router();

router.use(assignInteractionId);

router.use("/patient", patientRouter);

router.use("/doctor", doctorRouter);

router.use("/slot", auth, slotRouter);

router.use("/consultation", auth, consultationRouter);

router.use("/appointment", auth, appointmentRouter);

export default router;