import { IthbatSDK } from './ithbat-sdk';
import { IthbatError } from './http-client';

function makeJwt(payload: Record<string, unknown>): string {
  const part = (o: object): string => Buffer.from(JSON.stringify(o)).toString('base64url');
  return `${part({ alg: 'none', typ: 'JWT' })}.${part(payload)}.sig`;
}

describe('IthbatSDK', () => {
  let sdk: IthbatSDK;

  beforeEach(() => {
    sdk = new IthbatSDK({ basePath: 'http://localhost:8080', tenantId: 'test-tenant-id' });
  });

  describe('initialization', () => {
    it('initializes every API namespace', () => {
      expect(sdk.auth).toBeDefined();
      expect(sdk.users).toBeDefined();
      expect(sdk.tenants).toBeDefined();
      expect(sdk.roles).toBeDefined();
      expect(sdk.groups).toBeDefined();
      expect(sdk.audit).toBeDefined();
      expect(sdk.sessions).toBeDefined();
      expect(sdk.mfa).toBeDefined();
    });
  });

  describe('access token accessor', () => {
    it('returns undefined before any token is set', () => {
      expect(sdk.getAccessToken()).toBeUndefined();
    });

    it('returns the token set via setAccessToken', () => {
      sdk.setAccessToken('tok-123');
      expect(sdk.getAccessToken()).toBe('tok-123');
    });
  });

  describe('isTokenExpired (T10 — reads the live token, not the construction-time one)', () => {
    it('returns true when no token is set', () => {
      expect(sdk.isTokenExpired()).toBe(true);
    });

    it('returns false for a token set via setAccessToken with a future exp', () => {
      const future = Math.floor(Date.now() / 1000) + 3600;
      sdk.setAccessToken(makeJwt({ exp: future }));
      expect(sdk.isTokenExpired()).toBe(false);
    });

    it('returns true for a token that has expired', () => {
      const past = Math.floor(Date.now() / 1000) - 3600;
      sdk.setAccessToken(makeJwt({ exp: past }));
      expect(sdk.isTokenExpired()).toBe(true);
    });

    it('returns true for a token without an exp claim', () => {
      sdk.setAccessToken(makeJwt({ sub: 'u1' }));
      expect(sdk.isTokenExpired()).toBe(true);
    });

    it('returns true for a malformed token', () => {
      sdk.setAccessToken('not-a-jwt');
      expect(sdk.isTokenExpired()).toBe(true);
    });

    it('reflects a token supplied at construction time', () => {
      const future = Math.floor(Date.now() / 1000) + 3600;
      const configured = new IthbatSDK({
        basePath: 'http://localhost:8080',
        accessToken: makeJwt({ exp: future }),
      });
      expect(configured.isTokenExpired()).toBe(false);
    });
  });

  describe('error classification helpers', () => {
    it('isAuthError is true only for a 401 IthbatError', () => {
      expect(sdk.isAuthError(new IthbatError('x', 401, 'UNAUTHORIZED'))).toBe(true);
      expect(sdk.isAuthError(new IthbatError('x', 400, 'BAD'))).toBe(false);
      expect(sdk.isAuthError(new Error('plain'))).toBe(false);
    });

    it('isValidationError requires a 400 with non-empty details', () => {
      const valid = new IthbatError('x', 400, 'VALIDATION_ERROR', [{ field: 'email', message: 'bad' }]);
      expect(sdk.isValidationError(valid)).toBe(true);
      expect(sdk.isValidationError(new IthbatError('x', 400, 'VALIDATION_ERROR'))).toBe(false);
      expect(sdk.isValidationError(new IthbatError('x', 500, 'ERR'))).toBe(false);
    });

    it('getValidationErrors returns the details for a validation error, else []', () => {
      const details = [{ field: 'email', message: 'bad' }];
      const valid = new IthbatError('x', 400, 'VALIDATION_ERROR', details);
      expect(sdk.getValidationErrors(valid)).toEqual(details);
      expect(sdk.getValidationErrors(new Error('plain'))).toEqual([]);
    });
  });

  describe('authenticate (M2M)', () => {
    it('exchanges client credentials and stores the access token', async () => {
      const future = Math.floor(Date.now() / 1000) + 3600;
      const spy = jest.spyOn(sdk.auth, 'clientCredentials').mockResolvedValue({
        access_token: makeJwt({ exp: future }),
        token_type: 'Bearer',
        expires_in: 3600,
      });

      await sdk.authenticate('cid', 'secret', 'openid');

      expect(spy).toHaveBeenCalledWith('cid', 'secret', 'openid');
      expect(sdk.isTokenExpired()).toBe(false);
    });
  });
});
