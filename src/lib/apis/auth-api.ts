import { HttpClient } from '../http-client';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: UserInfo;
  mfaRequired?: boolean;
  mfaToken?: string;
}

export interface VerifyMfaRequest {
  mfaToken: string;
  code: string;
}

export interface VerifyMfaResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  familyName?: string;
  roles?: string[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  familyName?: string;
  tenantId: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  message: string;
}

export interface ClientCredentialsResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export class AuthApi {
  constructor(private http: HttpClient) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    return this.http.request<LoginResponse>({
      method: 'POST',
      path: '/auth/login',
      body: request,
    });
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    return this.http.request<RegisterResponse>({
      method: 'POST',
      path: '/auth/register',
      body: request,
    });
  }

  async verifyMfa(request: VerifyMfaRequest): Promise<VerifyMfaResponse> {
    return this.http.request<VerifyMfaResponse>({
      method: 'POST',
      path: '/auth/mfa/verify',
      body: request,
    });
  }

  async verifyBackupCode(request: VerifyMfaRequest): Promise<VerifyMfaResponse> {
    return this.http.request<VerifyMfaResponse>({
      method: 'POST',
      path: '/auth/mfa/verify-backup',
      body: request,
    });
  }

  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return this.http.request<RefreshTokenResponse>({
      method: 'POST',
      path: '/auth/refresh',
      body: request,
    });
  }

  async logout(): Promise<void> {
    return this.http.request<void>({
      method: 'POST',
      path: '/auth/logout',
    });
  }

  async me(): Promise<UserInfo> {
    return this.http.request<UserInfo>({
      method: 'GET',
      path: '/users/me',
    });
  }

  async resetPassword(request: ResetPasswordRequest): Promise<{ message: string }> {
    return this.http.request<{ message: string }>({
      method: 'POST',
      path: '/auth/password-reset/initiate',
      body: request,
    });
  }

  async changePassword(request: ChangePasswordRequest): Promise<{ message: string }> {
    return this.http.request<{ message: string }>({
      method: 'POST',
      path: '/auth/change-password',
      body: request,
    });
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    return this.http.request<{ message: string }>({
      method: 'POST',
      path: '/auth/verify-email',
      body: { token },
    });
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    return this.http.request<{ message: string }>({
      method: 'POST',
      path: '/auth/resend-verification',
      body: { email },
    });
  }

  async clientCredentials(clientId: string, clientSecret: string, scope = 'openid'): Promise<ClientCredentialsResponse> {
    return this.http.formRequest<ClientCredentialsResponse>(
      this.http.getBaseOrigin() + '/oauth/token',
      {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope,
      }
    );
  }
}
