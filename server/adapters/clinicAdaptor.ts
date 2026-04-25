export class ClinicAdapter {
  static toClinicProfileResponse(clinic: any) {
    if (!clinic) return null;

    return {
      id: clinic._id,
      name: clinic.name,
      registration: clinic.registrationNumber,
      description: clinic.description || "No description provided",
      logo: clinic.logo || null,
      rating: clinic.rating,
      isVerified: clinic.isVerified,

      // Contact & Location (Flattened for maps and headers)
      contact: {
        email: clinic.email,
        phone: clinic.phone,
        city: clinic.address?.city,
        fullAddress: clinic.address
          ? `${clinic.address.street}, ${clinic.address.city}, ${clinic.address.province} ${clinic.address.zipCode}`
          : "Address not provided",
        coordinates: clinic.address?.coordinates || null,
      },

      // Operational Status
      operations: {
        hours: clinic.hours || [],
        services: clinic.services || [],
      },

      // Staffing Overview - Just counts or IDs depending on population
      staffing: {
        doctorCount: clinic.staff?.doctors?.length || 0,
        nurseCount: clinic.staff?.nurses?.length || 0,
        doctors: clinic.staff?.doctors || [],
        nurses: clinic.staff?.nurses || [],
        adminId: clinic.staff?.adminId,
      },

      joinedAt: clinic.createdAt,
    };
  }

  /**
   * Transforms an array of clinics for "Find a Clinic" search results or map views
   */
  static toClinicListResponse(clinics: any[]) {
    if (!Array.isArray(clinics) || clinics.length === 0) return [];

    return clinics.map((clinic) => this.toClinicProfileResponse(clinic));
  }
}
