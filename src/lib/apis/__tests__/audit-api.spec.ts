import { AuditApi } from '../audit-api';
import { HttpClient } from '../../http-client';

function mockHttp(): HttpClient {
  return { request: jest.fn().mockResolvedValue({}) } as unknown as HttpClient;
}

describe('AuditApi', () => {
  let http: HttpClient;
  let api: AuditApi;

  beforeEach(() => {
    http = mockHttp();
    api = new AuditApi(http);
  });

  it('listEvents passes params', async () => {
    await api.listEvents({ page: 1, action: 'login' });
    expect(http.request).toHaveBeenCalledWith({
      method: 'GET',
      path: '/audit/events',
      params: { page: 1, action: 'login' },
    });
  });

  it('getEvent encodes the id', async () => {
    await api.getEvent('a/b');
    expect(http.request).toHaveBeenCalledWith({ method: 'GET', path: '/audit/events/a%2Fb' });
  });

  it('getStats gets /audit/stats', async () => {
    await api.getStats({ startDate: '2026-01-01' });
    expect(http.request).toHaveBeenCalledWith({
      method: 'GET',
      path: '/audit/stats',
      params: { startDate: '2026-01-01' },
    });
  });

  it('getLoginHistory gets /audit/logins', async () => {
    await api.getLoginHistory();
    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'GET', path: '/audit/logins' })
    );
  });

  it('getMyActivity gets /audit/me/activity', async () => {
    await api.getMyActivity();
    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/audit/me/activity' })
    );
  });

  it('getMyLoginHistory gets /audit/me/logins', async () => {
    await api.getMyLoginHistory();
    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/audit/me/logins' })
    );
  });

  it('getUserActivity encodes the id', async () => {
    await api.getUserActivity('u/1');
    expect(http.request).toHaveBeenCalledWith({
      method: 'GET',
      path: '/audit/users/u%2F1/activity',
      params: undefined,
    });
  });

  it('getUserLoginHistory encodes the id', async () => {
    await api.getUserLoginHistory('u/1');
    expect(http.request).toHaveBeenCalledWith({
      method: 'GET',
      path: '/audit/users/u%2F1/logins',
      params: undefined,
    });
  });

  it('getResourceHistory encodes both segments', async () => {
    await api.getResourceHistory('ty/pe', 'r/1');
    expect(http.request).toHaveBeenCalledWith({
      method: 'GET',
      path: '/audit/resources/ty%2Fpe/r%2F1/history',
      params: undefined,
    });
  });
});
