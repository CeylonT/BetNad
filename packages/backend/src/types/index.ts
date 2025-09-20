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
  accessToken: string;
  accessSecret: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface VerifyTokenRequest {
  accessToken: string;
  accessSecret: string;
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

export interface IPrivyWallet {
  _id?: string;
  userId: string;
  privyWalletId: string;
  address: string;
  chainType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletEntity {
  id: string;
  userId: string;
  privyWalletId: string;
  address: string;
  chainType: string;
  createdAt: Date;
  updatedAt: Date;
}
