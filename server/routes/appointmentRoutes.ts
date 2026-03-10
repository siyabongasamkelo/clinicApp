import express from "express";
import {
  createAppointment,
  updateAppointmentStatus,
  getAppointmentsByDate,
  getAllAppointments,
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/appointments/book
router.post("/book", protect, createAppointment);
router.get("/appointments", /*protect,*/ getAppointmentsByDate); // GET /api/appointments?date=YYYY-MM-DD
router.patch("/:id/status", /*protect,*/ updateAppointmentStatus);
router.get("/getAll", /*protect,*/ getAllAppointments);

export default router;
