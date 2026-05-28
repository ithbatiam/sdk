import { HttpClient } from '../http-client';
import { PagedResult } from '../config';

export interface User {
  id: string;
  tenantId: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  familyName?: string;
  phoneNumber?: string;
  phoneVerified: boolean;
  locale?: string;
  timezone?: string;
  isActive: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password?: string;
  firstName?: string;
  familyName?: string;
  phoneNumber?: string;
  sendInvite?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  familyName?: string;
  phoneNumber?: string;
  locale?: string;
  timezone?: string;
  isActive?: boolean;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class UsersApi {
  constructor(private http: HttpClient) {}

  async listUsers(params?: ListUsersParams): Promise<PagedResult<User>> {
    return this.http.requestPaged<User>({
      method: 'GET',
      path: '/users',
      params,
    });
  }

  async getUser(userId: string): Promise<User> {
    return this.http.request<User>({
      method: 'GET',
      path: `/users/${encodeURIComponent(userId)}`,
    });
  }

  async createUser(request: CreateUserRequest): Promise<User> {
    return this.http.request<User>({
      method: 'POST',
      path: '/users',
      body: request,
    });
  }

  async updateUser(userId: string, request: UpdateUserRequest): Promise<User> {
    return this.http.request<User>({
      method: 'PUT',
      path: `/users/${encodeURIComponent(userId)}`,
      body: request,
    });
  }

  async deleteUser(userId: string): Promise<void> {
    return this.http.request<void>({
      method: 'DELETE',
      path: `/users/${encodeURIComponent(userId)}`,
    });
  }

  async suspendUser(userId: string): Promise<void> {
    return this.http.request<void>({
      method: 'POST',
      path: `/users/${encodeURIComponent(userId)}/suspend`,
    });
  }

  async reactivateUser(userId: string): Promise<void> {
    return this.http.request<void>({
      method: 'POST',
      path: `/users/${encodeURIComponent(userId)}/reactivate`,
    });
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    return this.http.request<void>({
      method: 'POST',
      path: `/users/${encodeURIComponent(userId)}/roles`,
      body: { roleId },
    });
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    return this.http.request<void>({
      method: 'DELETE',
      path: `/users/${encodeURIComponent(userId)}/roles/${encodeURIComponent(roleId)}`,
    });
  }
}
