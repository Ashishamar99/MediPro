import express from "express";
import * as doctorController from "../controllers/doctor";
import multer from "multer";
import { auth } from "../middleware/auth";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

const router: any = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get(
  "/",
  auth,
  (
    req: express.Request<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >,
    res: express.Response<any, Record<string, any>>
  ) => {
    void doctorController.getDoctorsList(req, res);
  }
);

router.get(
  "/:id",
  auth,
  (
    req: express.Request<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >,
    res: express.Response<any, Record<string, any>>
  ) => {
    void doctorController.getDoctorWithID(req, res);
  }
);

router.patch(
  "/:id",
  auth,
  upload.single("signature"),
  (
    req: express.Request<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >,
    res: express.Response<any, Record<string, any>>
  ) => {
    void doctorController.handleSignatureFileUpload(req, res);
  }
);

router.delete(
  "/:id",
  auth,
  (
    req: express.Request<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >,
    res: express.Response<any, Record<string, any>>
  ) => {
    void doctorController.deleteDoctorWithID(req, res);
  }
);

router.post(
  "/get-doctor-with-role",
  auth,
  (
    req: express.Request<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >,
    res: express.Response<any, Record<string, any>>
  ) => {
    void doctorController.getDoctorWithRole(req, res);
  }
);

router.post(
  "/register",
  (
    req: express.Request<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >,
    res: express.Response<any, Record<string, any>>
  ) => {
    void doctorController.handleDoctorRegister(req, res);
  }
);

router.post(
  "/login",
  (
    req: express.Request<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >,
    res: express.Response<any, Record<string, any>>
  ) => {
    void doctorController.handleDoctorLogin(req, res);
  }
);

export default router;
