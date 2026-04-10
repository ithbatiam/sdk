import { HttpClient } from '../http-client';

export type MFAMethod = 'totp' | 'sms' | 'email' | 'backup_codes';

export interface SetupMFARequest {
  method: MFAMethod;
  password: string;
}

export interface SetupMFAResponse {
  secret?: string;
  qrCode?: string;
  backupCodes?: string[];
  message?: string;
}

export interface VerifyMFASetupRequest {
  code: string;
  method: MFAMethod;
}

export interface DisableMFARequest {
  password: string;
  method?: MFAMethod;
}

export interface RegenerateBackupCodesRequest {
  password: string;
}

export interface RegenerateBackupCodesResponse {
  backupCodes: string[];
}

export interface SetupSMSRequest {
  phoneNumber: string;
  password: string;
}

export class MFAApi {
  constructor(private http: HttpClient) {}

  async setup(request: SetupMFARequest): Promise<SetupMFAResponse> {
    return this.http.request<SetupMFAResponse>({
      method: 'POST',
      path: '/auth/mfa/setup',
      body: request,
    });
  }

  async verifySetup(request: VerifyMFASetupRequest): Promise<{ message: string }> {
    return this.http.request<{ message: string }>({
      method: 'POST',
      path: '/auth/mfa/verify-setup',
      body: request,
    });
  }

  async disable(request: DisableMFARequest): Promise<{ message: string }> {
    return this.http.request<{ message: string }>({
      method: 'POST',
      path: '/auth/mfa/disable',
      body: request,
    });
  }

  async regenerateBackupCodes(request: RegenerateBackupCodesRequest): Promise<RegenerateBackupCodesResponse> {
    return this.http.request<RegenerateBackupCodesResponse>({
      method: 'POST',
      path: '/auth/mfa/backup-codes',
      body: request,
    });
  }

  async setupSMS(request: SetupSMSRequest): Promise<{ message: string }> {
    return this.http.request<{ message: string }>({
      method: 'POST',
      path: '/auth/mfa/sms/setup',
      body: request,
    });
  }

  async verifySMSSetup(code: string): Promise<{ message: string }> {
    return this.http.request<{ message: string }>({
      method: 'POST',
      path: '/auth/mfa/sms/verify-setup',
      body: { code },
    });
  }

  async sendSMSOTP(): Promise<{ message: string }> {
    return this.http.request<{ message: string }>({
      method: 'POST',
      path: '/auth/mfa/sms/send',
    });
  }

  async disableSMS(request: DisableMFARequest): Promise<{ message: string }> {
    return this.http.request<{ message: string }>({
      method: 'POST',
      path: '/auth/mfa/sms/disable',
      body: request,
    });
  }
}
