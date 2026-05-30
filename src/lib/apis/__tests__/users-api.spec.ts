import { UsersApi } from '../users-api';
import { HttpClient } from '../../http-client';

function mockHttp(): HttpClient {
  return { request: jest.fn().mockResolvedValue({}), requestPaged: jest.fn().mockResolvedValue({ items: [], totalItems: 0, totalPages: 0, page: 1, pageSize: 0 }) } as unknown as HttpClient;
}

describe('UsersApi', () => {
  let http: HttpClient;
  let api: UsersApi;

  beforeEach(() => {
    http = mockHttp();
    api = new UsersApi(http);
  });

  it('listUsers passes query params', async () => {
    await api.listUsers({ page: 1, limit: 20, search: 'jo' });
    expect(http.requestPaged).toHaveBeenCalledWith({
      method: 'GET',
      path: '/users',
      params: { page: 1, limit: 20, search: 'jo' },
    });
  });

  it('getUser encodes the id and neutralises path traversal', async () => {
    await api.getUser('../9');
    expect(http.request).toHaveBeenCalledWith({ method: 'GET', path: '/users/..%2F9' });
  });

  it('createUser posts the body', async () => {
    await api.createUser({ email: 'a@b.com', firstName: 'J' });
    expect(http.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/users',
      body: { email: 'a@b.com', firstName: 'J' },
    });
  });

  it('updateUser encodes the id and posts the body', async () => {
    await api.updateUser('u 1', { firstName: 'Jane' });
    expect(http.request).toHaveBeenCalledWith({
      method: 'PUT',
      path: '/users/u%201',
      body: { firstName: 'Jane' },
    });
  });

  it('deleteUser encodes the id', async () => {
    await api.deleteUser('a/b');
    expect(http.request).toHaveBeenCalledWith({ method: 'DELETE', path: '/users/a%2Fb' });
  });

  it('suspendUser posts to the suspend sub-path', async () => {
    await api.suspendUser('u1');
    expect(http.request).toHaveBeenCalledWith({ method: 'POST', path: '/users/u1/suspend' });
  });

  it('reactivateUser posts to the reactivate sub-path', async () => {
    await api.reactivateUser('u1');
    expect(http.request).toHaveBeenCalledWith({ method: 'POST', path: '/users/u1/reactivate' });
  });

  it('assignRole encodes the id and posts the roleId', async () => {
    await api.assignRole('u1', 'r1');
    expect(http.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/users/u1/roles',
      body: { roleId: 'r1' },
    });
  });

  it('removeRole encodes both ids', async () => {
    await api.removeRole('u/1', 'r/2');
    expect(http.request).toHaveBeenCalledWith({
      method: 'DELETE',
      path: '/users/u%2F1/roles/r%2F2',
    });
  });
});
