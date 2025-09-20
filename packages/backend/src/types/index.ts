export interface User {
  _id?: string;
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest {
  user: User;
}

export interface LoginRequest {
  idToken: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface VerifyTokenRequest {
  idToken: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  user?: User;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
}
