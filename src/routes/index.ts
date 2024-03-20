import express from 'express';
import patientRouter from './patient';
import doctorRouter from './doctor';
import slotRouter from './slot';
import consultationRouter from './consultation';
import appointmentRouter from './appointment';

const router = express.Router();

router.use("/patient", patientRouter);

router.use("/doctor", doctorRouter);

router.use("/slot", slotRouter);

router.use("/consultation", consultationRouter);

router.use("/appointment", appointmentRouter);

export default router;