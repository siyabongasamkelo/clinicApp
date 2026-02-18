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
