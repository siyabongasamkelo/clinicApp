import { CLINIC_CONFIG } from "../config/clinicConfig.js";
import logger from "../utils/logger.js";

// FAKE DATA (Simulation)
const MOCK_STAFF = {
  nursesOnDuty: 15,
  doctorsOnDuty: 7,
};

const MOCK_EXISTING_BOOKINGS = 7; // Pretend 7 people already booked 04:00 AM

export const checkAvailability = async (requestedTime: Date) => {
  // 1. Calculate Dynamic Capacity based on your formula
  // (Nurses / Ratio) + (Doctors - Buffer)
  const capacity =
    Math.floor(MOCK_STAFF.nursesOnDuty / CLINIC_CONFIG.NURSE_TO_PATIENT_RATIO) +
    (MOCK_STAFF.doctorsOnDuty - CLINIC_CONFIG.DOCTOR_BUFFER);

  // 2. Compare against existing bookings
  const isFull = MOCK_EXISTING_BOOKINGS >= capacity;

  logger.info(
    `Capacity Check: ${MOCK_EXISTING_BOOKINGS}/${capacity} slots filled.`,
  );

  return {
    canBook: !isFull,
    slotsLeft: capacity - MOCK_EXISTING_BOOKINGS,
    totalCapacity: capacity,
  };
};
