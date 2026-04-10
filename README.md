# @ithbatiam/sdk

TypeScript SDK for the [Ithbat IAM](https://ithbat.io) platform. Provides a type-safe, promise-based interface for authentication, user management, and identity operations.

## Installation

```bash
npm install @ithbatiam/sdk
# or
yarn add @ithbatiam/sdk
# or
pnpm add @ithbatiam/sdk
```

## Quick Start

```typescript
import { IthbatSDK } from '@ithbatiam/sdk';

const sdk = new IthbatSDK({
  basePath: 'https://api.ithbat.io/api/v1',
  tenantId: 'YOUR_TENANT_ID',
});

const loginResult = await sdk.auth.login({
  email: 'user@example.com',
  password: 'SecurePass123!',
});

if (loginResult.mfaRequired) {
  const mfaResult = await sdk.auth.verifyMfa({
    mfaToken: loginResult.mfaToken!,
    code: '123456',
  });
  sdk.setAccessToken(mfaResult.accessToken);
} else {
  sdk.setAccessToken(loginResult.accessToken!);
}

const me = await sdk.auth.me();
console.log(me.email);
```

## M2M Authentication (Client Credentials)

For server-to-server communication without user interaction:

```typescript
const sdk = new IthbatSDK({
  basePath: 'https://api.ithbat.io/api/v1',
});

await sdk.authenticate('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET', 'openid');

const users = await sdk.users.listUsers({ page: 1, limit: 10 });
```

## Configuration

```typescript
const sdk = new IthbatSDK({
  basePath: 'https://api.ithbat.io/api/v1', // Required
  tenantId: 'YOUR_TENANT_ID',               // Required for user-context calls
  accessToken: 'optional-initial-token',     // Optional
  timeout: 30000,                            // Optional, ms
  headers: { 'X-Custom': 'value' },          // Optional
});
```

## API Namespaces

| Namespace | Purpose |
|---|---|
| `sdk.auth` | Login, register, MFA verify, password reset, client credentials |
| `sdk.users` | User CRUD, suspend, reactivate, role assignment |
| `sdk.roles` | Role CRUD, list permissions |
| `sdk.groups` | Group CRUD, member management |
| `sdk.tenants` | Tenant CRUD, current tenant, enabled features |
| `sdk.sessions` | List and revoke sessions |
| `sdk.mfa` | MFA setup (TOTP/SMS), backup codes |
| `sdk.audit` | Audit events, login history, user/resource activity |

## Pagination

All list methods return `PagedResult<T>`:

```typescript
interface PagedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
}
```

Usage:

```typescript
const result = await sdk.users.listUsers({ page: 1, limit: 20 });
console.log(`${result.totalItems} total users`);
result.items.forEach(user => console.log(user.email));

// Paginate through all pages
let page = 1;
const allUsers = [];
while (true) {
  const result = await sdk.users.listUsers({ page, limit: 50 });
  allUsers.push(...result.items);
  if (page >= result.totalPages) break;
  page++;
}
```

## Token Management

```typescript
sdk.setAccessToken(token);
sdk.setTenantId(tenantId);

if (sdk.isTokenExpired()) {
  const refreshed = await sdk.auth.refreshToken({ refreshToken });
  sdk.setAccessToken(refreshed.accessToken);
}
```

## Error Handling

```typescript
import { IthbatSDK, IthbatError } from '@ithbatiam/sdk';

try {
  await sdk.users.getUser('user-id');
} catch (error) {
  if (error instanceof IthbatError) {
    console.error(error.statusCode); // 404
    console.error(error.code);       // "NOT_FOUND"
    console.error(error.message);
  }
}

if (sdk.isAuthError(error)) { /* 401 */ }
if (sdk.isValidationError(error)) {
  const fields = sdk.getValidationErrors(error);
}
```

## Requirements

- Node.js 18+ (uses native `fetch`)
- TypeScript 5.0+ recommended

## Support

- Email: support@ithbat.io

## License

MIT
