export class DoctorAdapter {
  static toDoctorProfileResponse(doctor: any) {
    return {
      id: doctor?._id,
      fullName: doctor?.fullName,
      photo: doctor?.profilePhoto || "https://example.com",

      // Professional Branding
      professional: {
        specialization: doctor?.professional?.specialization,
        experience: `${doctor?.professional?.yearsOfExperience} years`,
        license: doctor?.professional?.licenseNo,
        rating: doctor?.professional?.averageRating,
      },

      // Contact - Flattened for easier UI binding
      contact: {
        phone: doctor?.contact?.phoneNumber,
        city: doctor?.contact?.address?.city,
        fullAddress: `${doctor?.contact?.address?.street}, ${doctor?.contact?.address?.city}`,
      },

      // Practice Details
      practice: {
        fee: `R${doctor?.practice?.consultationFee}` || "not specified", // Formatting currency
        isVerified: doctor?.practice?.isVerified,
        available: doctor?.practice?.isActive,
      },

      // Background - Keep as arrays for the "About" section
      about: {
        bio: doctor?.background?.bio,
        languages: doctor?.background?.languagesSpoken,
        qualifications: doctor?.background?.qualifications,
      },
    };
  }

  static toDoctorListResponse(doctors: any[]) {
    if (!doctors || doctors.length === 0) return [];

    // We map over the array and apply the transformation to each doctor
    return doctors.map((doctor) => this.toDoctorProfileResponse(doctor));
  }
}
