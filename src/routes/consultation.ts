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

router.post("/", (req: any, res: any) => {
  consultationController.createConsultationMetaData(req, res);
});

router.post(
  "/prescription",
  upload.single("prescription"),
  (req: any, res: any) => {
    consultationController.handlePrescriptionFileUpload(req, res);
  },
);
router.put("/prescription-content", (req: any, res: any) => {
  consultationController.updatePrescriptionContent(req, res);
});
export default router;
