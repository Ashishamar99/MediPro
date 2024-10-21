import express from "express";

import * as patientController from "../controllers/patient";
import { auth } from "../middleware/auth";
import { Request, ParamsDictionary, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
const router: any = express.Router();

router.get(
  "/",
  auth,
  (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>, number>,
  ) => {
    void patientController.getPatientsList(req, res);
  },
);

router.put(
  "/",
  auth,
  (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>, number>,
  ) => {
    patientController.updatePatientRegister(req, res);
  },
);

router.get(
  "/:id",
  auth,
  (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>, number>,
  ) => {
    patientController.getPatientWithID(req, res);
  },
);

router.post(
  "/register",
  (
    req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>, number>,
  ) => {
    patientController.handlePatientRegister(req, res);
  },
);

router.post(
  "/login",
  (
    req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>, number>,
  ) => {
    patientController.handlePatientLogin(req, res);
  },
);

export default router;
