import express from "express";
import * as consultationController from "../controllers/consultation";
import multer from "multer";
const router: any = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", (req: any, res: any) => {
  consultationController.getConsultationList(req, res);
});

router.get("/:id", (req: any, res: any) => {
  consultationController.getConsultationWithID(req, res);
});
router.get("/patient/:id", (req: any, res: any) => {
  consultationController.getPatientConsultation(req, res);
});
router.get("/doctor/:id", (req: any, res: any) => {
  consultationController.getDoctorConsultation(req, res);
});
router.post("/", upload.single("prescription"), (req: any, res: any) => {
  consultationController.addConsultationInfo(req, res);
});

export default router;
