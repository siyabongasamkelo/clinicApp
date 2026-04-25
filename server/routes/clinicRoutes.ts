import express from "express";
import dotenv from "dotenv";

// 1. Correct the extensions to .js (The ESM requirement)
import {
  findByTown,
  findById,
  findByName,
  updateClinic,
  createClinic,
} from "../controllers/clinicController.js";
import { validate } from "../middleware/validate.middleware";
import {
  ClinicZodSchema,
  getClinicByIdSchema,
  getClinicByNameSchema,
  getClinicByTownSchema,
} from "../validation/clinic.schema.js";
dotenv.config();

const router = express.Router();

router.post("/create-clinic", validate(ClinicZodSchema), createClinic);

router.post("/update-details/:id", validate(ClinicZodSchema), updateClinic);

router.post("/get-clinic", validate(getClinicByIdSchema), findById);

router.post("/find-by-name", validate(getClinicByNameSchema), findByName);

router.post("/find-by-town", validate(getClinicByTownSchema), findByTown);

export default router;
