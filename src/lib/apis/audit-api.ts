import { HttpClient } from '../http-client';
import { PagedResult } from '../config';

export interface AuditEvent {
  id: string;
  tenantId: string;
  userId?: string;
  userEmail?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  status: 'success' | 'failure';
  timestamp: string;
}

export interface ListAuditEventsParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  status?: 'success' | 'failure';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuditStats {
  totalLogs: number;
  successCount: number;
  failureCount: number;
  topActions: Array<{ action: string; count: number }>;
  topUsers: Array<{ userId: string; email: string; count: number }>;
}

export class AuditApi {
  constructor(private http: HttpClient) {}

  async listEvents(params?: ListAuditEventsParams): Promise<PagedResult<AuditEvent>> {
    return this.http.request<PagedResult<AuditEvent>>({
      method: 'GET',
      path: '/audit/events',
      params,
    });
  }

  async getEvent(eventId: string): Promise<AuditEvent> {
    return this.http.request<AuditEvent>({
      method: 'GET',
      path: `/audit/events/${eventId}`,
    });
  }

  async getStats(params?: { startDate?: string; endDate?: string }): Promise<AuditStats> {
    return this.http.request<AuditStats>({
      method: 'GET',
      path: '/audit/stats',
      params,
    });
  }

  async getLoginHistory(params?: ListAuditEventsParams): Promise<PagedResult<AuditEvent>> {
    return this.http.request<PagedResult<AuditEvent>>({
      method: 'GET',
      path: '/audit/logins',
      params,
    });
  }

  async getMyActivity(params?: { page?: number; limit?: number }): Promise<PagedResult<AuditEvent>> {
    return this.http.request<PagedResult<AuditEvent>>({
      method: 'GET',
      path: '/audit/me/activity',
      params,
    });
  }

  async getMyLoginHistory(params?: { page?: number; limit?: number }): Promise<PagedResult<AuditEvent>> {
    return this.http.request<PagedResult<AuditEvent>>({
      method: 'GET',
      path: '/audit/me/logins',
      params,
    });
  }

  async getUserActivity(
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PagedResult<AuditEvent>> {
    return this.http.request<PagedResult<AuditEvent>>({
      method: 'GET',
      path: `/audit/users/${userId}/activity`,
      params,
    });
  }

  async getUserLoginHistory(
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PagedResult<AuditEvent>> {
    return this.http.request<PagedResult<AuditEvent>>({
      method: 'GET',
      path: `/audit/users/${userId}/logins`,
      params,
    });
  }

  async getResourceHistory(
    resourceType: string,
    resourceId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PagedResult<AuditEvent>> {
    return this.http.request<PagedResult<AuditEvent>>({
      method: 'GET',
      path: `/audit/resources/${resourceType}/${resourceId}/history`,
      params,
    });
  }
}
