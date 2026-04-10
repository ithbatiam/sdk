import { HttpClient } from '../http-client';
import { PagedResult } from '../config';

export interface Session {
  id: string;
  userId: string;
  tenantId: string;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: string;
  location?: {
    city?: string;
    region?: string;
    country?: string;
  };
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
  expiresAt: string;
}

export class SessionsApi {
  constructor(private http: HttpClient) {}

  async getMySessions(params?: { page?: number; limit?: number }): Promise<PagedResult<Session>> {
    return this.http.request<PagedResult<Session>>({
      method: 'GET',
      path: '/auth/sessions',
      params,
    });
  }

  async revokeSession(sessionId: string): Promise<void> {
    return this.http.request<void>({
      method: 'DELETE',
      path: `/auth/sessions/${sessionId}`,
    });
  }

  async revokeAllOtherSessions(): Promise<void> {
    return this.http.request<void>({
      method: 'DELETE',
      path: '/auth/sessions',
    });
  }

  async getUserSessions(
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PagedResult<Session>> {
    return this.http.request<PagedResult<Session>>({
      method: 'GET',
      path: `/users/${userId}/sessions`,
      params,
    });
  }

  async revokeUserSessions(userId: string): Promise<void> {
    return this.http.request<void>({
      method: 'DELETE',
      path: `/users/${userId}/sessions`,
    });
  }
}
