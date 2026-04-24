import express from "express";
import dotenv from "dotenv";

// 1. Correct the extensions to .js (The ESM requirement)
import {
  updatePatient,
  findPatient,
  findByClinic,
} from "../controllers/patientController.js";
import { validate } from "../middleware/validate.middleware";
import {
  updatePatientSchema,
  getPatientByIdSchema,
  getPatientByClinicSchema,
} from "../validation/patient.Schema.js";
dotenv.config();

const router = express.Router();

router.post(
  "/update-details/:id",
  validate(updatePatientSchema),
  updatePatient,
);

router.post("/get-patient", validate(getPatientByIdSchema), findPatient);

router.post(
  "/find-by-Clinic",
  validate(getPatientByClinicSchema),
  findByClinic,
); // clinics do not exist yet and so we cannot search using them

export default router;
