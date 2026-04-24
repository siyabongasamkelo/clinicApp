export class NurseAdapter {
  static toNurseProfileResponse(nurse: any) {
    if (!nurse) return null;

    return {
      id: nurse._id,
      nurseId: nurse.nurseId,
      fullName: nurse.fullName,
      email: nurse.email,

      // Professional Branding & Rank
      professional: {
        rank: nurse.professional?.nursingRank,
        license: nurse.professional?.licenseNumber,
        department: nurse.professional?.departmentAssignment,
        isTriageCertified: nurse.professional?.triageCertified,
        canPrescribe: nurse.professional?.canPrescribe,
        skills: nurse.professional?.specializedSkills || [],
      },

      // Deployment/Status Information
      status: {
        isOnDuty: nurse.deployment?.isOnDuty,
        shift: nurse.deployment?.shiftType,
        clinicId: nurse.deployment?.clinicId,
        supervisorId: nurse.deployment?.supervisingDoctorId,
      },

      // Contact & Location - Flattened for UI convenience
      contact: {
        phone: nurse.contact?.phoneNumber,
        city: nurse.contact?.address?.city,
        fullAddress: nurse.contact?.address
          ? `${nurse.contact.address.street}, ${nurse.contact.address.city}, ${nurse.contact.address.state}`
          : "Address not provided",
      },

      // Extras for the "About" or "Profile" section
      languages: nurse.professional?.languages || [],
      joinedAt: nurse.createdAt,
    };
  }

  /**
   * Transforms an array of nurses for list views (like a dashboard table)
   */
  static toNurseListResponse(nurses: any[]) {
    if (!Array.isArray(nurses) || nurses.length === 0) return [];

    return nurses.map((nurse) => this.toNurseProfileResponse(nurse));
  }
}
