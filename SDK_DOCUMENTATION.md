# Ithbat TypeScript SDK Documentation

Complete documentation for the Ithbat TypeScript SDK.

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Configuration](#configuration)
4. [Authentication](#authentication)
5. [API Reference](#api-reference)
6. [Error Handling](#error-handling)
7. [Advanced Usage](#advanced-usage)
8. [Development](#development)

## Installation

```bash
npm install @ithbatiam/sdk
```

```typescript
import { IthbatSDK } from '@ithbatiam/sdk';
```

## Quick Start

```typescript
import { IthbatSDK } from '@ithbatiam/sdk';

// Initialize the SDK
const sdk = new IthbatSDK({
  basePath: 'https://api.ithbat.io/api/v1',
  tenantId: 'your-tenant-id'
});

// Login
const { accessToken, user } = await sdk.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Set the access token for authenticated requests
sdk.setAccessToken(accessToken);

// Make authenticated requests
const users = await sdk.users.listUsers({ page: 1, limit: 20 });
```

## Configuration

### IthbatConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `basePath` | `string` | Yes | Base URL for the API |
| `accessToken` | `string` | No | JWT access token for authentication |
| `tenantId` | `string` | No | Tenant ID for multi-tenant requests |
| `headers` | `Record<string, string>` | No | Additional headers for all requests |
| `timeout` | `number` | No | Request timeout in milliseconds (default: 30000) |

### Environment-Specific Configuration

```typescript
// Development (pointing to a local backend instance)
const devSdk = new IthbatSDK({
  basePath: 'http://localhost:8080',
  tenantId: 'dev-tenant-id',
  timeout: 30000
});

// Production
const prodSdk = new IthbatSDK({
  basePath: 'https://api.ithbat.io/api/v1',
  tenantId: 'prod-tenant-id',
  timeout: 30000
});
```

## Authentication

### Login

```typescript
const loginResponse = await sdk.auth.login({
  email: 'user@example.com',
  password: 'securePassword123',
  rememberMe: true
});

sdk.setAccessToken(loginResponse.accessToken);
// Store refresh token
localStorage.setItem('refreshToken', loginResponse.refreshToken);
```

### Register

```typescript
const registerResponse = await sdk.auth.register({
  email: 'newuser@example.com',
  password: 'securePassword123',
  firstName: 'John',
  lastName: 'Doe',
  tenantId: 'your-tenant-id'
});
```

### Token Refresh

```typescript
const refreshToken = localStorage.getItem('refreshToken');

const refreshResponse = await sdk.auth.refreshToken({
  refreshToken: refreshToken!
});

sdk.setAccessToken(refreshResponse.accessToken);
localStorage.setItem('refreshToken', refreshResponse.refreshToken);
```

### Logout

```typescript
await sdk.auth.logout();
// Clear stored tokens
localStorage.removeItem('refreshToken');
sdk.setAccessToken('');
```

### Password Reset

```typescript
// Initiate password reset
await sdk.auth.resetPassword({
  email: 'user@example.com'
});

// User receives reset link via email
```

### Change Password

```typescript
await sdk.auth.changePassword({
  oldPassword: 'currentPassword',
  newPassword: 'newSecurePassword123'
});
```

### Email Verification

```typescript
// Verify email with token from email link
await sdk.auth.verifyEmail('verification-token');

// Resend verification email
await sdk.auth.resendVerification('user@example.com');
```

## API Reference

### Auth API

#### Methods

- `login(request: LoginRequest): Promise<LoginResponse>`
- `register(request: RegisterRequest): Promise<RegisterResponse>`
- `refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse>`
- `logout(): Promise<void>`
- `me(): Promise<UserInfo>`
- `resetPassword(request: ResetPasswordRequest): Promise<{ message: string }>`
- `changePassword(request: ChangePasswordRequest): Promise<{ message: string }>`
- `verifyEmail(token: string): Promise<{ message: string }>`
- `resendVerification(email: string): Promise<{ message: string }>`

### Users API

#### List Users

```typescript
const usersResponse = await sdk.users.listUsers({
  page: 1,
  limit: 20,
  search: 'john',
  isActive: true,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

console.log(usersResponse.users);
console.log(usersResponse.pagination);
```

#### Get User

```typescript
const user = await sdk.users.getUser('user-id-123');
```

#### Create User

```typescript
const newUser = await sdk.users.createUser({
  email: 'newuser@example.com',
  password: 'securePassword',
  firstName: 'John',
  lastName: 'Doe',
  sendInvite: true
});
```

#### Update User

```typescript
const updatedUser = await sdk.users.updateUser('user-id-123', {
  firstName: 'Jane',
  isActive: false
});
```

#### Delete User

```typescript
await sdk.users.deleteUser('user-id-123');
```

#### Role Assignment

```typescript
// Assign role
await sdk.users.assignRole('user-id-123', 'role-id-456');

// Remove role
await sdk.users.removeRole('user-id-123', 'role-id-456');

// Get user roles
const roles = await sdk.users.getUserRoles('user-id-123');
```

### Tenants API

#### Get Current Tenant

```typescript
const tenant = await sdk.tenants.getCurrentTenant();
```

#### List Tenants (Admin Only)

```typescript
const tenantsResponse = await sdk.tenants.listTenants({
  page: 1,
  limit: 20,
  plan: 'pro',
  status: 'active'
});
```

#### Create Tenant

```typescript
const newTenant = await sdk.tenants.createTenant({
  name: 'New Company',
  slug: 'new-company',
  plan: 'free',
  adminEmail: 'admin@newcompany.com',
  adminPassword: 'securePassword123'
});
```

#### Update Tenant

```typescript
const updatedTenant = await sdk.tenants.updateTenant('tenant-id', {
  name: 'Updated Company Name',
  settings: {
    locale: 'en',
    timezone: 'America/New_York',
    theme: {
      primaryColor: '#008FA8',
      logo: 'https://example.com/logo.png'
    }
  }
});
```

#### Manage Tenant Status

```typescript
// Upgrade plan
await sdk.tenants.upgradePlan('tenant-id', 'pro');

// Suspend tenant
await sdk.tenants.suspendTenant('tenant-id', 'Non-payment');

// Reactivate tenant
await sdk.tenants.reactivateTenant('tenant-id');

// Delete tenant
await sdk.tenants.deleteTenant('tenant-id');
```

### Roles API

#### List Roles

```typescript
const rolesResponse = await sdk.roles.listRoles({
  page: 1,
  limit: 50
});
```

#### Create Role

```typescript
const newRole = await sdk.roles.createRole({
  name: 'Content Editor',
  description: 'Can create and edit content',
  permissions: ['content:read', 'content:write', 'content:delete']
});
```

#### Update Role

```typescript
const updatedRole = await sdk.roles.updateRole('role-id', {
  name: 'Senior Content Editor',
  permissions: ['content:read', 'content:write', 'content:delete', 'content:publish']
});
```

#### List Permissions

```typescript
const permissions = await sdk.roles.listPermissions();
console.log(permissions.permissions);
```

## Error Handling

The SDK provides structured error handling through the `IthbatError` class.

### Error Properties

- `message`: Human-readable error message
- `statusCode`: HTTP status code
- `code`: Error code (e.g., 'UNAUTHORIZED', 'VALIDATION_ERROR')
- `details`: Array of detailed error information

### Example

```typescript
import { IthbatError } from '@ithbatiam/sdk';

try {
  await sdk.users.createUser(invalidData);
} catch (error) {
  if (error instanceof IthbatError) {
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Status:', error.statusCode);

    if (error.details) {
      error.details.forEach(detail => {
        console.error(`${detail.field}: ${detail.message}`);
      });
    }

    // Handle specific errors
    switch (error.code) {
      case 'UNAUTHORIZED':
        // Redirect to login
        break;
      case 'VALIDATION_ERROR':
        // Show validation errors
        break;
      case 'NOT_FOUND':
        // Show 404 page
        break;
      default:
        // Show generic error
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Missing or invalid authentication |
| `FORBIDDEN` | User lacks required permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid request data |
| `CONFLICT` | Resource already exists |
| `INTERNAL_ERROR` | Server error |
| `NETWORK_ERROR` | Network connectivity issue |

## Advanced Usage

### Multi-Tenant Context Switching

```typescript
// Initialize with default tenant
const sdk = new IthbatSDK({
  basePath: 'https://api.ithbat.io/api/v1',
  tenantId: 'tenant-1'
});

// Switch to different tenant
sdk.setTenantId('tenant-2');

// All subsequent requests use tenant-2
const users = await sdk.users.listUsers();

// Switch back
sdk.setTenantId('tenant-1');
```

### Custom Headers

```typescript
const sdk = new IthbatSDK({
  basePath: 'https://api.ithbat.io/api/v1',
  tenantId: 'your-tenant-id',
  headers: {
    'X-Custom-Header': 'custom-value',
    'X-Request-Source': 'mobile-app',
    'X-Client-Version': '1.0.0'
  }
});
```

### Request Timeout

```typescript
const sdk = new IthbatSDK({
  basePath: 'https://api.ithbat.io/api/v1',
  tenantId: 'your-tenant-id',
  timeout: 60000 // 60 seconds
});
```

## Development

### Project Structure

```
sdk/
├── src/
│   ├── lib/
│   │   ├── apis/           # API client classes
│   │   │   ├── auth-api.ts
│   │   │   ├── users-api.ts
│   │   │   ├── tenants-api.ts
│   │   │   └── roles-api.ts
│   │   ├── examples/       # Usage examples
│   │   ├── ithbat-sdk.ts   # Main SDK class
│   │   ├── config.ts       # Configuration types
│   │   └── http-client.ts  # HTTP client
│   └── index.ts            # Public exports
├── tsconfig.json           # TypeScript configuration
└── README.md               # Documentation
```

### Building the SDK

```bash
npm run build
```

### Testing

```bash
npm test
npm run test:ci
```


### Adding New API Endpoints

1. Create or update the API class in `src/lib/apis/`
2. Define request/response types
3. Implement the method using `this.http.request()`
4. Export from `src/index.ts`
5. Update documentation

Example:

```typescript
// In src/lib/apis/users-api.ts
export interface NewFeatureRequest {
  name: string;
  value: string;
}

export class UsersApi {
  // ... existing methods

  async newFeature(request: NewFeatureRequest): Promise<void> {
    return this.http.request<void>({
      method: 'POST',
      path: '/api/v1/users/new-feature',
      body: request
    });
  }
}
```

## License

MIT License - see LICENSE file for details.

## Support

For issues or questions:
- GitHub Issues: https://github.com/ithbat/ithbat
- Email: support@ithbat.io
- Documentation: https://docs.ithbat.io
