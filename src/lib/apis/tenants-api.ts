import { HttpClient } from '../http-client';
import { PagedResult } from '../config';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  plan: 'b2c-free' | 'b2c-pro' | 'b2c-scale' | 'b2b-free' | 'b2b-business' | 'b2b-enterprise';
  status: 'active' | 'suspended' | 'deleted';
  settings: TenantSettings;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSettings {
  locale?: string;
  timezone?: string;
  theme?: {
    primaryColor?: string;
    logo?: string;
  };
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  plan?: 'b2c-free' | 'b2c-pro' | 'b2c-scale' | 'b2b-free' | 'b2b-business' | 'b2b-enterprise';
  adminEmail: string;
  adminPassword?: string;
}

export interface UpdateTenantRequest {
  name?: string;
  domain?: string;
  settings?: Partial<TenantSettings>;
}

export interface ListTenantsParams {
  page?: number;
  limit?: number;
  search?: string;
  plan?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}


export class TenantsApi {
  constructor(private http: HttpClient) {}

  async listTenants(params?: ListTenantsParams): Promise<PagedResult<Tenant>> {
    return this.http.request<PagedResult<Tenant>>({
      method: 'GET',
      path: '/tenants',
      params,
    });
  }

  async getTenant(tenantId: string): Promise<Tenant> {
    return this.http.request<Tenant>({
      method: 'GET',
      path: `/tenants/${tenantId}`,
    });
  }

  async getCurrentTenant(): Promise<Tenant> {
    return this.http.request<Tenant>({
      method: 'GET',
      path: '/tenants/current',
    });
  }

  async createTenant(request: CreateTenantRequest): Promise<Tenant> {
    return this.http.request<Tenant>({
      method: 'POST',
      path: '/tenants',
      body: request,
    });
  }

  async updateTenant(tenantId: string, request: UpdateTenantRequest): Promise<Tenant> {
    return this.http.request<Tenant>({
      method: 'PUT',
      path: `/tenants/${tenantId}`,
      body: request,
    });
  }

  async deleteTenant(tenantId: string): Promise<void> {
    return this.http.request<void>({
      method: 'DELETE',
      path: `/tenants/${tenantId}`,
    });
  }

  async suspendTenant(tenantId: string, reason?: string): Promise<void> {
    return this.http.request<void>({
      method: 'POST',
      path: `/tenants/${tenantId}/suspend`,
      body: { reason },
    });
  }

  async reactivateTenant(tenantId: string): Promise<void> {
    return this.http.request<void>({
      method: 'POST',
      path: `/tenants/${tenantId}/reactivate`,
    });
  }

  async getEnabledFeatures(): Promise<{ features: string[] }> {
    return this.http.request<{ features: string[] }>({
      method: 'GET',
      path: '/tenant/features',
    });
  }
}
