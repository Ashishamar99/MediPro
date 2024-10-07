import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import logger from "./utils/logger";
import router from "./routes";

dotenv.config();
const app = express();
const port = process.env.PORT ?? 5002;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "5mb" }));

app.get("/health", (_req, res) => {
  res.json({ uptime: process.uptime(), message: "OK", timestamp: new Date() });
});

app.use("/api", router)

app.listen(port, () => {
  logger.info(`Application started at port ${port}`);
});

export default app;
