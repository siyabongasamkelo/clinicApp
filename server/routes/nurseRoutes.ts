import express from "express";
import dotenv from "dotenv";

// 1. Correct the extensions to .js (The ESM requirement)
import {
  updateNurse,
  findNurse,
  findByClinic,
} from "../controllers/nurseController.js";
import { validate } from "../middleware/validate.middleware";
import {
  updateNurseSchema,
  getNurseByIdSchema,
  getNurseByClinicSchema,
} from "../validation/nurse.schema.js";
dotenv.config();

const router = express.Router();

router.post("/update-details/:id", validate(updateNurseSchema), updateNurse);

router.post("/get-nurse", validate(getNurseByIdSchema), findNurse);

router.post("/find-by-Clinic", validate(getNurseByClinicSchema), findByClinic); // clinics do not exist yet and so we cannot search using them

export default router;
