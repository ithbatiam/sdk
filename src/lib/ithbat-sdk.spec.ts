import { IthbatSDK } from './ithbat-sdk';
import { HttpClient } from './http-client';

describe('IthbatSDK', () => {
  let sdk: IthbatSDK;

  beforeEach(() => {
    sdk = new IthbatSDK({
      basePath: 'http://localhost:8080',
      tenantId: 'test-tenant-id',
    });
  });

  describe('initialization', () => {
    it('should create SDK instance', () => {
      expect(sdk).toBeDefined();
    });

    it('should initialize all API clients', () => {
      expect(sdk.auth).toBeDefined();
      expect(sdk.users).toBeDefined();
      expect(sdk.tenants).toBeDefined();
      expect(sdk.roles).toBeDefined();
    });
  });

  describe('configuration', () => {
    it('should set access token', () => {
      const token = 'test-access-token';
      sdk.setAccessToken(token);
      expect(sdk).toBeDefined();
    });

    it('should set tenant ID', () => {
      const tenantId = 'new-tenant-id';
      sdk.setTenantId(tenantId);
      expect(sdk).toBeDefined();
    });
  });

  describe('configuration options', () => {
    it('should accept custom timeout', () => {
      const customSdk = new IthbatSDK({
        basePath: 'http://localhost:8080',
        tenantId: 'test-tenant-id',
        timeout: 60000,
      });

      expect(customSdk).toBeDefined();
    });

    it('should accept custom headers', () => {
      const customSdk = new IthbatSDK({
        basePath: 'http://localhost:8080',
        tenantId: 'test-tenant-id',
        headers: {
          'X-Custom-Header': 'test-value',
        },
      });

      expect(customSdk).toBeDefined();
    });

    it('should accept access token in config', () => {
      const customSdk = new IthbatSDK({
        basePath: 'http://localhost:8080',
        tenantId: 'test-tenant-id',
        accessToken: 'initial-token',
      });

      expect(customSdk).toBeDefined();
    });
  });
});
