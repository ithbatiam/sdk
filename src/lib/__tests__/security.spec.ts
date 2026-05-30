import { HttpClient, IthbatError } from '../http-client';
import { AuthApi } from '../apis/auth-api';

describe('security: HTTPS enforcement (T7)', () => {
  it('rejects a non-loopback http:// basePath', () => {
    expect(() => new HttpClient({ basePath: 'http://api.ithbat.io' })).toThrow(IthbatError);
    try {
      new HttpClient({ basePath: 'http://api.ithbat.io' });
    } catch (e) {
      expect((e as IthbatError).code).toBe('INSECURE_BASE_PATH');
    }
  });

  it('allows https://', () => {
    expect(() => new HttpClient({ basePath: 'https://api.ithbat.io' })).not.toThrow();
  });

  it('allows http://localhost and 127.0.0.1 for local development', () => {
    expect(() => new HttpClient({ basePath: 'http://localhost:8080' })).not.toThrow();
    expect(() => new HttpClient({ basePath: 'http://127.0.0.1:8080' })).not.toThrow();
  });

  it('rejects a malformed basePath', () => {
    expect(() => new HttpClient({ basePath: 'not a url' })).toThrow(IthbatError);
  });
});

describe('security: M2M client-secret browser guard (T3)', () => {
  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it('clientCredentials refuses to run in a browser context', async () => {
    (globalThis as { window?: unknown }).window = { document: {} };
    const auth = new AuthApi(new HttpClient({ basePath: 'https://api.ithbat.io' }));
    await expect(auth.clientCredentials('id', 'secret')).rejects.toMatchObject({
      code: 'BROWSER_CONTEXT_FORBIDDEN',
    });
  });
});

describe('security: error serialization carries no token (T8)', () => {
  it('toJSON exposes only safe fields and never a bearer token', () => {
    const err = new IthbatError('boom', 401, 'UNAUTHORIZED');
    const json = JSON.stringify(err);
    expect(json).not.toContain('Bearer');
    expect(JSON.parse(json)).toEqual({
      name: 'IthbatError',
      message: 'boom',
      statusCode: 401,
      code: 'UNAUTHORIZED',
    });
  });
});
