import { TenantsApi } from '../tenants-api';
import { HttpClient } from '../../http-client';

function mockHttp(): HttpClient {
  return { request: jest.fn().mockResolvedValue({}) } as unknown as HttpClient;
}

describe('TenantsApi', () => {
  let http: HttpClient;
  let api: TenantsApi;

  beforeEach(() => {
    http = mockHttp();
    api = new TenantsApi(http);
  });

  it('listTenants passes params', async () => {
    await api.listTenants({ page: 1, status: 'active' });
    expect(http.request).toHaveBeenCalledWith({
      method: 'GET',
      path: '/tenants',
      params: { page: 1, status: 'active' },
    });
  });

  it('getTenant encodes the id', async () => {
    await api.getTenant('a/b');
    expect(http.request).toHaveBeenCalledWith({ method: 'GET', path: '/tenants/a%2Fb' });
  });

  it('getCurrentTenant gets /tenants/current', async () => {
    await api.getCurrentTenant();
    expect(http.request).toHaveBeenCalledWith({ method: 'GET', path: '/tenants/current' });
  });

  it('createTenant posts the body', async () => {
    await api.createTenant({ name: 'Co', slug: 'co', adminEmail: 'a@b.com' });
    expect(http.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/tenants',
      body: { name: 'Co', slug: 'co', adminEmail: 'a@b.com' },
    });
  });

  it('updateTenant encodes the id and posts the body', async () => {
    await api.updateTenant('t1', { name: 'New' });
    expect(http.request).toHaveBeenCalledWith({ method: 'PUT', path: '/tenants/t1', body: { name: 'New' } });
  });

  it('deleteTenant encodes the id', async () => {
    await api.deleteTenant('t1');
    expect(http.request).toHaveBeenCalledWith({ method: 'DELETE', path: '/tenants/t1' });
  });

  it('suspendTenant encodes the id and posts the reason', async () => {
    await api.suspendTenant('t 1', 'Non-payment');
    expect(http.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/tenants/t%201/suspend',
      body: { reason: 'Non-payment' },
    });
  });

  it('reactivateTenant encodes the id', async () => {
    await api.reactivateTenant('t1');
    expect(http.request).toHaveBeenCalledWith({ method: 'POST', path: '/tenants/t1/reactivate' });
  });

  it('getEnabledFeatures gets /tenant/features', async () => {
    await api.getEnabledFeatures();
    expect(http.request).toHaveBeenCalledWith({ method: 'GET', path: '/tenant/features' });
  });
});
