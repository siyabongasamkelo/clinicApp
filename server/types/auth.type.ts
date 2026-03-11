export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  id: string;
  token: string;
}

export interface RegisterBody {
  email?: string;
  password?: string;
  username?: string;
  role?: string;
}

export interface VerifyEmailRequestBody {
  email?: string;
}

export interface PatientLoginBody {
  email?: string;
  password?: string;
}

export interface VerifyEmailBody {
  email?: string;
  token?: string;
}

export interface ForgotPasswordLinkBody {
  email?: string;
  token?: string;
}

export interface ResetPasswordBody {
  email?: string;
  password?: string;
  id?: string;
  token?: string;
}

export interface UserPayload {
  id: string;
}
