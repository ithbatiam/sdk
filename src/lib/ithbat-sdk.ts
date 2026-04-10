import { IthbatConfig } from './config';
import { HttpClient, IthbatError } from './http-client';
import { AuthApi } from './apis/auth-api';
import { UsersApi } from './apis/users-api';
import { TenantsApi } from './apis/tenants-api';
import { RolesApi } from './apis/roles-api';
import { GroupsApi } from './apis/groups-api';
import { AuditApi } from './apis/audit-api';
import { SessionsApi } from './apis/sessions-api';
import { MFAApi } from './apis/mfa-api';

export class IthbatSDK {
  private httpClient: HttpClient;
  private config: IthbatConfig;

  public readonly auth: AuthApi;
  public readonly users: UsersApi;
  public readonly tenants: TenantsApi;
  public readonly roles: RolesApi;
  public readonly groups: GroupsApi;
  public readonly audit: AuditApi;
  public readonly sessions: SessionsApi;
  public readonly mfa: MFAApi;

  constructor(config: IthbatConfig) {
    this.config = config;
    this.httpClient = new HttpClient(config);

    this.auth = new AuthApi(this.httpClient);
    this.users = new UsersApi(this.httpClient);
    this.tenants = new TenantsApi(this.httpClient);
    this.roles = new RolesApi(this.httpClient);
    this.groups = new GroupsApi(this.httpClient);
    this.audit = new AuditApi(this.httpClient);
    this.sessions = new SessionsApi(this.httpClient);
    this.mfa = new MFAApi(this.httpClient);
  }

  setAccessToken(token: string): void {
    this.httpClient.setAccessToken(token);
  }

  setTenantId(tenantId: string): void {
    this.httpClient.setTenantId(tenantId);
  }

  async authenticate(clientId: string, clientSecret: string, scope = 'openid'): Promise<void> {
    const response = await this.auth.clientCredentials(clientId, clientSecret, scope);
    this.httpClient.setAccessToken(response.access_token);
  }

  isTokenExpired(): boolean {
    const token = this.config.accessToken;
    if (!token) return true;

    try {
      const payload = this.decodeJWT(token);
      if (!payload.exp) return true;
      return payload.exp * 1000 - Date.now() <= 60 * 1000;
    } catch {
      return true;
    }
  }

  isAuthError(error: unknown): boolean {
    return error instanceof IthbatError && error.statusCode === 401;
  }

  isValidationError(error: unknown): boolean {
    return (
      error instanceof IthbatError &&
      error.statusCode === 400 &&
      Array.isArray(error.details) &&
      error.details.length > 0
    );
  }

  getValidationErrors(error: unknown): Array<{ field?: string; message: string }> {
    if (this.isValidationError(error) && error instanceof IthbatError) {
      return error.details || [];
    }
    return [];
  }

  private decodeJWT(token: string): { exp?: number; iat?: number; sub?: string; [key: string]: unknown } {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    return JSON.parse(atob(padded));
  }

  destroy(): void {}
}

export interface ValidationError {
  field?: string;
  message: string;
}
