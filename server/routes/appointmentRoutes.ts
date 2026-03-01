import express from "express";
import {
  createAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/appointments/book
router.post("/book", protect, createAppointment);
router.patch("/:id/status", protect, updateAppointmentStatus);

export default router;
