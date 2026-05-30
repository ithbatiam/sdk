import { RolesApi } from '../roles-api';
import { HttpClient } from '../../http-client';

function mockHttp(): HttpClient {
  return { request: jest.fn().mockResolvedValue({}), requestPaged: jest.fn().mockResolvedValue({ items: [], totalItems: 0, totalPages: 0, page: 1, pageSize: 0 }) } as unknown as HttpClient;
}

describe('RolesApi', () => {
  let http: HttpClient;
  let api: RolesApi;

  beforeEach(() => {
    http = mockHttp();
    api = new RolesApi(http);
  });

  it('listRoles passes params', async () => {
    await api.listRoles({ page: 1, limit: 50 });
    expect(http.requestPaged).toHaveBeenCalledWith({
      method: 'GET',
      path: '/roles',
      params: { page: 1, limit: 50 },
    });
  });

  it('getRole encodes the id', async () => {
    await api.getRole('a/b');
    expect(http.request).toHaveBeenCalledWith({ method: 'GET', path: '/roles/a%2Fb' });
  });

  it('createRole posts the body', async () => {
    await api.createRole({ name: 'Editor', permissions: ['x:read'] });
    expect(http.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/roles',
      body: { name: 'Editor', permissions: ['x:read'] },
    });
  });

  it('updateRole encodes the id and posts the body', async () => {
    await api.updateRole('r1', { name: 'Senior' });
    expect(http.request).toHaveBeenCalledWith({
      method: 'PUT',
      path: '/roles/r1',
      body: { name: 'Senior' },
    });
  });

  it('deleteRole encodes the id', async () => {
    await api.deleteRole('r 1');
    expect(http.request).toHaveBeenCalledWith({ method: 'DELETE', path: '/roles/r%201' });
  });

  it('listPermissions gets /permissions', async () => {
    await api.listPermissions();
    expect(http.request).toHaveBeenCalledWith({ method: 'GET', path: '/permissions' });
  });
});
