import { HttpClient, IthbatError } from '../http-client';
import { IthbatConfig } from '../config';

// Mock fetch
global.fetch = jest.fn();

describe('HttpClient', () => {
  let httpClient: HttpClient;
  const mockConfig: IthbatConfig = {
    basePath: 'https://api.ithbat.test',
    tenantId: 'test-tenant',
    accessToken: 'test-token',
    timeout: 30000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    httpClient = new HttpClient(mockConfig);
  });

  describe('Initialization', () => {
    it('should create HTTP client with config', () => {
      expect(httpClient).toBeInstanceOf(HttpClient);
    });

    it('should use default timeout if not provided', () => {
      const clientWithoutTimeout = new HttpClient({
        basePath: 'https://api.test.com',
      });
      expect(clientWithoutTimeout).toBeInstanceOf(HttpClient);
    });
  });

  describe('Token Management', () => {
    it('should update access token', () => {
      const newToken = 'new-token';
      httpClient.setAccessToken(newToken);

      // Verify by checking if the token is used in headers
      const headers = (httpClient as any).buildHeaders();
      expect(headers.get('Authorization')).toBe(`Bearer ${newToken}`);
    });

    it('should update tenant ID', () => {
      const newTenantId = 'new-tenant';
      httpClient.setTenantId(newTenantId);

      // Verify by checking if the tenant ID is used in headers
      const headers = (httpClient as any).buildHeaders();
      expect(headers.get('X-Tenant-ID')).toBe(newTenantId);
    });
  });

  describe('Request Building', () => {
    it('should build URL with query parameters', () => {
      const url = (httpClient as any).buildUrl('/users', {
        page: 1,
        limit: 20,
        search: 'test',
      });

      expect(url).toContain('https://api.ithbat.test/users');
      expect(url).toContain('page=1');
      expect(url).toContain('limit=20');
      expect(url).toContain('search=test');
    });

    it('should handle URL with trailing slash', () => {
      const clientWithSlash = new HttpClient({
        basePath: 'https://api.ithbat.test/',
      });
      const url = (clientWithSlash as any).buildUrl('/users');
      expect(url).toBe('https://api.ithbat.test/users');
    });

    it('should handle URL without leading slash in path', () => {
      const url = (httpClient as any).buildUrl('users');
      expect(url).toBe('https://api.ithbat.test/users');
    });

    it('should filter out null and undefined query params', () => {
      const url = (httpClient as any).buildUrl('/users', {
        page: 1,
        search: undefined,
        filter: null,
        limit: 20,
      });

      expect(url).toContain('page=1');
      expect(url).toContain('limit=20');
      expect(url).not.toContain('search');
      expect(url).not.toContain('filter');
    });

    it('should handle array query parameters', () => {
      const url = (httpClient as any).buildUrl('/users', {
        roles: ['admin', 'user'],
      });

      expect(url).toContain('roles=admin');
      expect(url).toContain('roles=user');
    });

    it('should encode query parameters', () => {
      const url = (httpClient as any).buildUrl('/users', {
        search: 'test & value',
      });

      expect(url).toContain('search=test%20%26%20value');
    });
  });

  describe('Header Building', () => {
    it('should include default headers', () => {
      const headers = (httpClient as any).buildHeaders();

      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('Accept')).toBe('application/json');
    });

    it('should include authorization header when token is set', () => {
      const headers = (httpClient as any).buildHeaders();
      expect(headers.get('Authorization')).toBe('Bearer test-token');
    });

    it('should include tenant ID header when set', () => {
      const headers = (httpClient as any).buildHeaders();
      expect(headers.get('X-Tenant-ID')).toBe('test-tenant');
    });

    it('should merge config headers', () => {
      const clientWithHeaders = new HttpClient({
        basePath: 'https://api.test.com',
        headers: { 'X-Custom-Header': 'custom-value' },
      });

      const headers = (clientWithHeaders as any).buildHeaders();
      expect(headers.get('X-Custom-Header')).toBe('custom-value');
    });

    it('should merge request-specific headers', () => {
      const headers = (httpClient as any).buildHeaders({
        'X-Request-ID': 'req-123',
      });

      expect(headers.get('X-Request-ID')).toBe('req-123');
    });

    it('should allow request headers to override config headers', () => {
      const headers = (httpClient as any).buildHeaders({
        'Content-Type': 'application/xml',
      });

      expect(headers.get('Content-Type')).toBe('application/xml');
    });
  });

  describe('HTTP Requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = { data: { id: '1', name: 'Test' } };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await httpClient.request({
        method: 'GET',
        path: '/users/1',
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.ithbat.test/users/1',
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Headers),
        })
      );
    });

    it('should make successful POST request with body', async () => {
      const requestBody = { name: 'Test User', email: 'test@example.com' };
      const mockResponse = { data: { id: '1', ...requestBody } };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      });

      const result = await httpClient.request({
        method: 'POST',
        path: '/users',
        body: requestBody,
      });

      expect(result).toEqual(mockResponse);
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[1].body).toBe(JSON.stringify(requestBody));
    });

    it('should handle 204 No Content response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const result = await httpClient.request({
        method: 'DELETE',
        path: '/users/1',
      });

      expect(result).toEqual({});
    });

    it('should not include body in GET request', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await httpClient.request({
        method: 'GET',
        path: '/users',
        body: { shouldBeIgnored: true },
      });

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[1].body).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should throw IthbatError for API errors', async () => {
      const errorResponse = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: [{ field: 'email', message: 'Invalid email format' }],
        },
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => errorResponse,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => errorResponse,
        });

      await expect(
        httpClient.request({
          method: 'POST',
          path: '/users',
          body: { email: 'invalid' },
        })
      ).rejects.toThrow(IthbatError);

      await expect(
        httpClient.request({
          method: 'POST',
          path: '/users',
          body: { email: 'invalid' },
        })
      ).rejects.toMatchObject({
        message: 'Invalid input',
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        details: [{ field: 'email', message: 'Invalid email format' }],
      });
    });

    it('should throw IthbatError for 401 Unauthorized', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid credentials',
          },
        }),
      });

      await expect(
        httpClient.request({
          method: 'POST',
          path: '/auth/login',
          body: { email: 'test@example.com', password: 'wrong' },
        })
      ).rejects.toThrow(IthbatError);
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(
        httpClient.request({
          method: 'GET',
          path: '/users',
        })
      ).rejects.toThrow(IthbatError);

      await expect(
        httpClient.request({
          method: 'GET',
          path: '/users',
        })
      ).rejects.toMatchObject({
        code: 'NETWORK_ERROR',
        statusCode: 0,
      });
    });

    it('should handle fetch timeout', async () => {
      // Mock AbortSignal.timeout to throw
      const originalTimeout = AbortSignal.timeout;
      AbortSignal.timeout = jest.fn(() => {
        const signal = new AbortController().signal;
        setTimeout(() => {
          throw new Error('Timeout');
        }, 0);
        return signal;
      }) as any;

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Timeout'));

      await expect(
        httpClient.request({
          method: 'GET',
          path: '/users',
        })
      ).rejects.toThrow();

      AbortSignal.timeout = originalTimeout;
    });
  });

  describe('IthbatError Class', () => {
    it('should create error with all properties', () => {
      const error = new IthbatError('Test error', 400, 'TEST_ERROR', [
        { field: 'test', message: 'Test message' },
      ]);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(IthbatError);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.details).toEqual([{ field: 'test', message: 'Test message' }]);
      expect(error.name).toBe('IthbatError');
    });

    it('should work with instanceof checks', () => {
      const error = new IthbatError('Test', 500, 'ERROR');
      expect(error instanceof Error).toBe(true);
      expect(error instanceof IthbatError).toBe(true);
    });
  });
});
