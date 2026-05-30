import { SessionsApi } from '../sessions-api';
import { HttpClient } from '../../http-client';

function mockHttp(): HttpClient {
  return { request: jest.fn().mockResolvedValue({}), requestPaged: jest.fn().mockResolvedValue({ items: [], totalItems: 0, totalPages: 0, page: 1, pageSize: 0 }) } as unknown as HttpClient;
}

describe('SessionsApi', () => {
  let http: HttpClient;
  let api: SessionsApi;

  beforeEach(() => {
    http = mockHttp();
    api = new SessionsApi(http);
  });

  it('getMySessions passes params', async () => {
    await api.getMySessions({ page: 1 });
    expect(http.requestPaged).toHaveBeenCalledWith({
      method: 'GET',
      path: '/auth/sessions',
      params: { page: 1 },
    });
  });

  it('revokeSession encodes the id', async () => {
    await api.revokeSession('a/b');
    expect(http.request).toHaveBeenCalledWith({ method: 'DELETE', path: '/auth/sessions/a%2Fb' });
  });

  it('revokeAllOtherSessions deletes /auth/sessions', async () => {
    await api.revokeAllOtherSessions();
    expect(http.request).toHaveBeenCalledWith({ method: 'DELETE', path: '/auth/sessions' });
  });

  it('getUserSessions encodes the id', async () => {
    await api.getUserSessions('u 1');
    expect(http.requestPaged).toHaveBeenCalledWith({
      method: 'GET',
      path: '/users/u%201/sessions',
      params: undefined,
    });
  });

  it('revokeUserSessions encodes the id', async () => {
    await api.revokeUserSessions('u/1');
    expect(http.request).toHaveBeenCalledWith({ method: 'DELETE', path: '/users/u%2F1/sessions' });
  });
});
