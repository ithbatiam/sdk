import { HttpClient } from '../http-client';
import { PagedResult } from '../config';

export interface Role {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface ListRolesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class RolesApi {
  constructor(private http: HttpClient) {}

  async listRoles(params?: ListRolesParams): Promise<PagedResult<Role>> {
    return this.http.request<PagedResult<Role>>({
      method: 'GET',
      path: '/roles',
      params,
    });
  }

  async getRole(roleId: string): Promise<Role> {
    return this.http.request<Role>({
      method: 'GET',
      path: `/roles/${roleId}`,
    });
  }

  async createRole(request: CreateRoleRequest): Promise<Role> {
    return this.http.request<Role>({
      method: 'POST',
      path: '/roles',
      body: request,
    });
  }

  async updateRole(roleId: string, request: UpdateRoleRequest): Promise<Role> {
    return this.http.request<Role>({
      method: 'PUT',
      path: `/roles/${roleId}`,
      body: request,
    });
  }

  async deleteRole(roleId: string): Promise<void> {
    return this.http.request<void>({
      method: 'DELETE',
      path: `/roles/${roleId}`,
    });
  }

  async listPermissions(): Promise<{ permissions: string[] }> {
    return this.http.request<{ permissions: string[] }>({
      method: 'GET',
      path: '/permissions',
    });
  }
}
