import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";

import patientRouter from "./routes/patient";
import doctorRouter from "./routes/doctor";
import slotRouter from "./routes/slot";
import consultationRouter from "./routes/consultation";
import appointmentRouter from "./routes/appointment";

import logger from "./logger";
import prisma from "./database/prisma";
dotenv.config();
const app = express();
const port = process.env.PORT ?? 5002;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "5mb" }));

app.get("/health", (_req, res) => {
  res.json({ uptime: process.uptime(), message: "OK", timestamp: new Date() });
});

app.use("/api/patient", patientRouter);

app.use("/api/doctor", doctorRouter);

app.use("/api/slot", slotRouter);

app.use("/api/consultation", consultationRouter);

app.use("/api/appointment", appointmentRouter);

app.listen(port, () => {
  logger.info(`Application started at port ${port}`);
});

cron.schedule('0 0 * * *', async () => {
  logger.info('Running a task every day at midnight');
  // reset slot status to available everyday at midnight
  const slots = await prisma.slot.updateMany({
    where: {
      status: "booked",
    },
    data: {
      status: "available",
    },
  });
  logger.info(`Reset ${slots.count} slots to available`);
});

export default app;