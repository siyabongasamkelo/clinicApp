// interfaces/IUser.ts
export interface IUser {
  id: string;
  identifier: string; // staffId or email
  role: string;
  fullName: string;
  // Common data needed by the app
}
