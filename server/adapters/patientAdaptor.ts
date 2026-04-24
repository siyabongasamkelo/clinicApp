export class PatientAdapter {
  static toPatientProfileResponse(patient: any) {
    if (!patient) return null;

    return {
      id: patient._id,
      userId: patient.userId,
      fullName: patient.fullName,
      email: patient.email,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      isVerified: patient.isVerified,

      // Medical Profile - Cleaned up for the health dashboard
      health: {
        bloodGroup: patient.medicalHistory?.bloodGroup,
        allergies: patient.medicalHistory?.allergies || [],
        conditions: patient.medicalHistory?.chronicConditions || [],
        medication: patient.medicalHistory?.currentMedication || [],
      },

      // Insurance & Admin Info
      coverage: {
        provider: patient.insurance?.provider,
        policyNumber: patient.insurance?.policyNumber,
      },

      // Contact & Emergency (Flattened)
      contact: {
        phone: patient.contactNumber,
        emergencyName: patient.personal?.emergencyContact?.name,
        emergencyPhone: patient.personal?.emergencyContact?.phone,
        address: patient.address
          ? `${patient.address.street}, ${patient.address.city}, ${patient.address.zipCode}`
          : "Address not provided",
      },

      // Lifestyle Data
      lifestyle: {
        occupation: patient.personal?.occupation,
        smoking: patient.personal?.lifestyle?.smokingStatus,
        alcohol: patient.personal?.lifestyle?.alcoholConsumption,
      },

      // Clinical Context
      clinical: {
        assignedDoctor: patient.clinicContext?.assignedDoctorId,
        clinic: patient.clinicContext?.nearbyClinicId,
        lastVisit: patient.clinicContext?.lastVisitDate,
      },

      joinedAt: patient.createdAt,
    };
  }

  /**
   * Transforms an array of patients for dashboard tables/lists
   */
  static toPatientListResponse(patients: any[]) {
    if (!Array.isArray(patients) || patients.length === 0) return [];

    return patients.map((patient) => this.toPatientProfileResponse(patient));
  }
}
