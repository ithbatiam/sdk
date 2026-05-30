import { HttpClient } from '../http-client';
import { IthbatConfig } from '../config';

global.fetch = jest.fn();

describe('HttpClient.requestPaged', () => {
  let http: HttpClient;
  const config: IthbatConfig = { basePath: 'https://api.ithbat.test', timeout: 30000 };

  beforeEach(() => {
    jest.clearAllMocks();
    http = new HttpClient(config);
  });

  const respond = (body: unknown, status = 200) =>
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: status < 400, status, json: async () => body });

  it('folds {data:[...], meta.pagination} into a PagedResult', async () => {
    respond({
      data: [{ id: 'a' }, { id: 'b' }],
      meta: { pagination: { totalItems: 42, totalPages: 21, page: 2, pageSize: 2 } },
    });

    const result = await http.requestPaged<{ id: string }>({ method: 'GET', path: '/users' });

    expect(result.items).toEqual([{ id: 'a' }, { id: 'b' }]);
    expect(result.totalItems).toBe(42);
    expect(result.totalPages).toBe(21);
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(2);
  });

  it('derives pagination defaults from items when meta is absent', async () => {
    respond({ data: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] });

    const result = await http.requestPaged<{ id: string }>({ method: 'GET', path: '/roles' });

    expect(result.items).toHaveLength(3);
    expect(result.totalItems).toBe(3);
    expect(result.totalPages).toBe(1);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(3);
  });

  it('returns an empty page when data is not an array', async () => {
    respond({ data: { not: 'an array' }, meta: {} });

    const result = await http.requestPaged({ method: 'GET', path: '/groups' });

    expect(result.items).toEqual([]);
    expect(result.totalItems).toBe(0);
    expect(result.pageSize).toBe(0);
  });

  it('returns an empty page on 204 No Content', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 204 });

    const result = await http.requestPaged({ method: 'GET', path: '/audit/events' });

    expect(result.items).toEqual([]);
    expect(result.totalItems).toBe(0);
  });

  it('surfaces backend errors as IthbatError, not a malformed page', async () => {
    respond({ error: { code: 'FORBIDDEN', message: 'nope' } }, 403);

    await expect(http.requestPaged({ method: 'GET', path: '/tenants' })).rejects.toMatchObject({
      name: 'IthbatError',
      statusCode: 403,
      code: 'FORBIDDEN',
    });
  });
});
