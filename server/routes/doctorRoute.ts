import express from "express";
import dotenv from "dotenv";

// 1. Correct the extensions to .js (The ESM requirement)
import {
  updateDoctor,
  findDoctor,
  findByClinic,
} from "../controllers/doctorController.js";
import { validate } from "../middleware/validate.middleware";
import {
  updateDoctorSchema,
  getDoctorByIdSchema,
  getDoctorByClinicSchema,
} from "../validation/doctor.schema.js";
dotenv.config();

const router = express.Router();

router.post("/update-details/:id", validate(updateDoctorSchema), updateDoctor);

router.post("/get-doctor", validate(getDoctorByIdSchema), findDoctor);

router.post("/find-by-Clinic", validate(getDoctorByClinicSchema), findByClinic); // clinics do not exist yet and so we cannot search using them

export default router;
