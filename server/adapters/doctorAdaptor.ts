// adapters/DoctorAdapter.ts
export class DoctorAdapter {
  static toUpdateFormat(rawBody: any): IDoctorUpdateInput {
    // Map raw request body to our structured sub-document interface
    return {
      contact: rawBody.contact,
      practice: rawBody.practice,
      professional: rawBody.professional,
      bio: rawBody.bio,
    };
  }
}
