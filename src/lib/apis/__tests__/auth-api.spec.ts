import { AuthApi } from '../auth-api';
import { HttpClient } from '../../http-client';

function mockHttp(): HttpClient {
  return {
    request: jest.fn().mockResolvedValue({}),
    formRequest: jest.fn().mockResolvedValue({}),
    getBaseOrigin: jest.fn().mockReturnValue('https://api.ithbat.test'),
  } as unknown as HttpClient;
}

describe('AuthApi', () => {
  let http: HttpClient;
  let api: AuthApi;

  beforeEach(() => {
    http = mockHttp();
    api = new AuthApi(http);
  });

  it('login posts credentials to /auth/login', async () => {
    await api.login({ email: 'a@b.com', password: 'x' });
    expect(http.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/auth/login',
      body: { email: 'a@b.com', password: 'x' },
    });
  });

  it('register posts to /auth/register', async () => {
    await api.register({ email: 'a@b.com', password: 'x', tenantId: 't1' });
    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'POST', path: '/auth/register' })
    );
  });

  it('verifyMfa posts to /auth/mfa/verify', async () => {
    await api.verifyMfa({ mfaToken: 'm', code: '123456' });
    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'POST', path: '/auth/mfa/verify' })
    );
  });

  it('verifyBackupCode posts to /auth/mfa/verify-backup', async () => {
    await api.verifyBackupCode({ mfaToken: 'm', code: 'abc' });
    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/auth/mfa/verify-backup' })
    );
  });

  it('refreshToken posts to /auth/refresh', async () => {
    await api.refreshToken({ refreshToken: 'r' });
    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'POST', path: '/auth/refresh' })
    );
  });

  it('logout posts to /auth/logout', async () => {
    await api.logout();
    expect(http.request).toHaveBeenCalledWith({ method: 'POST', path: '/auth/logout' });
  });

  it('me gets /users/me', async () => {
    await api.me();
    expect(http.request).toHaveBeenCalledWith({ method: 'GET', path: '/users/me' });
  });

  it('resetPassword posts to /auth/password-reset/initiate', async () => {
    await api.resetPassword({ email: 'a@b.com' });
    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/auth/password-reset/initiate' })
    );
  });

  it('changePassword maps to the backend snake_case contract', async () => {
    await api.changePassword({ currentPassword: 'old-pw', newPassword: 'new-pw' });
    expect(http.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/auth/change-password',
      body: { current_password: 'old-pw', new_password: 'new-pw' },
    });
  });

  it('verifyEmail posts the token', async () => {
    await api.verifyEmail('tok');
    expect(http.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/auth/verify-email',
      body: { token: 'tok' },
    });
  });

  it('resendVerification posts the email', async () => {
    await api.resendVerification('a@b.com');
    expect(http.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/auth/resend-verification',
      body: { email: 'a@b.com' },
    });
  });

  it('clientCredentials posts the form grant to /oauth/token in a server context', async () => {
    await api.clientCredentials('cid', 'secret', 'openid');
    expect(http.formRequest).toHaveBeenCalledWith('https://api.ithbat.test/oauth/token', {
      grant_type: 'client_credentials',
      client_id: 'cid',
      client_secret: 'secret',
      scope: 'openid',
    });
  });
});
