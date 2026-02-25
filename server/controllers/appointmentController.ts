const calculateCapacity = (nursesOnDuty, doctorsOnDuty) => {
  const nurseRatio = 2; // 2 nurses per patient
  const doctorBuffer = 1; // Always keep 1 doctor free for emergencies

  const capacity =
    Math.floor(nursesOnDuty / nurseRatio) + (doctorsOnDuty - doctorBuffer);
  return Math.max(capacity, 1); // Ensure at least 1 person can book
};
