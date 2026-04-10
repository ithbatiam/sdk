export { IthbatSDK } from './lib/ithbat-sdk';
export type { ValidationError } from './lib/ithbat-sdk';

export type {
  IthbatConfig,
  RequestOptions,
  ApiResponse,
  ApiError,
  PagedResult,
} from './lib/config';

export { HttpClient, IthbatError } from './lib/http-client';

// Auth API
export { AuthApi } from './lib/apis/auth-api';
export type {
  LoginRequest,
  LoginResponse,
  VerifyMfaRequest,
  VerifyMfaResponse,
  UserInfo,
  RegisterRequest,
  RegisterResponse,
  ClientCredentialsResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from './lib/apis/auth-api';

// Users API
export { UsersApi } from './lib/apis/users-api';
export type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ListUsersParams,
} from './lib/apis/users-api';

// Tenants API
export { TenantsApi } from './lib/apis/tenants-api';
export type {
  Tenant,
  TenantSettings,
  CreateTenantRequest,
  UpdateTenantRequest,
  ListTenantsParams,
} from './lib/apis/tenants-api';

// Roles API
export { RolesApi } from './lib/apis/roles-api';
export type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  ListRolesParams,
} from './lib/apis/roles-api';

// Groups API
export { GroupsApi } from './lib/apis/groups-api';
export type {
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
  ListGroupsParams,
  GroupMember,
} from './lib/apis/groups-api';

// Audit API
export { AuditApi } from './lib/apis/audit-api';
export type {
  AuditEvent,
  ListAuditEventsParams,
  AuditStats,
} from './lib/apis/audit-api';

// Sessions API
export { SessionsApi } from './lib/apis/sessions-api';
export type { Session } from './lib/apis/sessions-api';

// MFA API
export { MFAApi } from './lib/apis/mfa-api';
export type {
  MFAMethod,
  SetupMFARequest,
  SetupMFAResponse,
  VerifyMFASetupRequest,
  DisableMFARequest,
  RegenerateBackupCodesRequest,
  RegenerateBackupCodesResponse,
  SetupSMSRequest,
} from './lib/apis/mfa-api';
