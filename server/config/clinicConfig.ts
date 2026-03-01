export const CLINIC_CONFIG = {
  OPENING_HOUR: 4, // 04:00 AM
  CLOSING_HOUR: 19, // 07:00 PM
  SESSION_DURATION_MINUTES: 90, // 1.5 Hours
  DEFAULT_MAX_PATIENTS_PER_SESSION: 8,

  // For the Dynamic Formula later:
  NURSE_TO_PATIENT_RATIO: 2, // 2 nurses per patient
  DOCTOR_BUFFER: 1, // Keep one doctor free
};

export const SESSION_MAP = [
  { id: 1, start: "04:00", end: "05:30" },
  { id: 2, start: "05:30", end: "07:00" },
  { id: 3, start: "07:00", end: "08:30" },
  { id: 4, start: "08:30", end: "10:00" },
  { id: 5, start: "10:00", end: "11:30" },
  { id: 6, start: "11:30", end: "13:00" },
  { id: 7, start: "13:00", end: "14:30" },
  { id: 8, start: "14:30", end: "16:00" },
  { id: 9, start: "16:00", end: "17:30" },
  { id: 10, start: "17:30", end: "19:00" },
];
// Total: 10 Sessions (15 hours / 1.5h)
