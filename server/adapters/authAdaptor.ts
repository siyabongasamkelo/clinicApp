// adapters/AuthAdapter.ts
import { IAuthResponse } from "../types/auth.type";

export class AuthAdapter {
  static toRegisterResponse(user: any): IAuthResponse {
    return {
      userId: user._id.toString(),
      role: user.role,
      message: "Account created successfully. Welcome aboard!",
    };
  }

  static toLoginResponse(user: any, profile: any, token: string) {
    return {
      token,
      user: {
        id: user._id,
        identifier: user.identifier,
        role: user.role,
        fullName: profile?.fullName || "User",
        // Flatten specific profile data if needed
        isVerified: profile?.practice?.isVerified ?? false,
      },
    };
  }
}
