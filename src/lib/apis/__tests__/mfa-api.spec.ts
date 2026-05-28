import { MFAApi } from '../mfa-api';
import { HttpClient } from '../../http-client';

function mockHttp(): HttpClient {
  return { request: jest.fn().mockResolvedValue({}), requestPaged: jest.fn().mockResolvedValue({ items: [], totalItems: 0, totalPages: 0, page: 1, pageSize: 0 }) } as unknown as HttpClient;
}

describe('MFAApi', () => {
  let http: HttpClient;
  let api: MFAApi;

  beforeEach(() => {
    http = mockHttp();
    api = new MFAApi(http);
  });

  it('setup posts method + password', async () => {
    await api.setup({ method: 'totp', password: 'pw' });
    expect(http.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/auth/mfa/setup',
      body: { method: 'totp', password: 'pw' },
    });
  });

  it('verifySetup posts to /auth/mfa/verify-setup', async () => {
    await api.verifySetup({ code: '123456', method: 'totp' });
    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/auth/mfa/verify-setup' })
    );
  });

  it('disable posts to /auth/mfa/disable', async () => {
    await api.disable({ password: 'pw' });
    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'POST', path: '/auth/mfa/disable' })
    );
  });

  it('regenerateBackupCodes posts to /auth/mfa/backup-codes', async () => {
    await api.regenerateBackupCodes({ password: 'pw' });
    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/auth/mfa/backup-codes' })
    );
  });

  it('setupSMS posts phone + password', async () => {
    await api.setupSMS({ phoneNumber: '+100', password: 'pw' });
    expect(http.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/auth/mfa/sms/setup',
      body: { phoneNumber: '+100', password: 'pw' },
    });
  });

  it('verifySMSSetup posts the code', async () => {
    await api.verifySMSSetup('123456');
    expect(http.request).toHaveBeenCalledWith({
      method: 'POST',
      path: '/auth/mfa/sms/verify-setup',
      body: { code: '123456' },
    });
  });

  it('sendSMSOTP posts to /auth/mfa/sms/send', async () => {
    await api.sendSMSOTP();
    expect(http.request).toHaveBeenCalledWith({ method: 'POST', path: '/auth/mfa/sms/send' });
  });

  it('disableSMS posts to /auth/mfa/sms/disable', async () => {
    await api.disableSMS({ password: 'pw' });
    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/auth/mfa/sms/disable' })
    );
  });
});
