# Ithbat SDK Quick Start

Get started with the Ithbat TypeScript SDK in 5 minutes.

## Installation

```bash
npm install @ithbatiam/sdk
```

```typescript
import { IthbatSDK } from '@ithbatiam/sdk';
```

## Basic Usage

### 1. Initialize the SDK

```typescript
const sdk = new IthbatSDK({
  basePath: 'https://api.ithbat.io/api/v1',
  tenantId: 'your-tenant-id',
});
```

### 2. Login

```typescript
const result = await sdk.auth.login({
  email: 'user@example.com',
  password: 'password',
});

if (result.mfaRequired) {
  const mfa = await sdk.auth.verifyMfa({
    mfaToken: result.mfaToken!,
    code: '123456',
  });
  sdk.setAccessToken(mfa.accessToken);
} else {
  sdk.setAccessToken(result.accessToken!);
}
```

### 3. Make API Calls

```typescript
const me = await sdk.auth.me();

const users = await sdk.users.listUsers({ page: 1, limit: 20 });
console.log(`${users.totalItems} total users`);
users.items.forEach(u => console.log(u.email));

const newUser = await sdk.users.createUser({
  email: 'newuser@example.com',
  firstName: 'John',
  familyName: 'Doe',
  sendInvite: true,
});
```

## M2M (Server-to-Server)

```typescript
const sdk = new IthbatSDK({
  basePath: 'https://api.ithbat.io/api/v1',
});

await sdk.authenticate('CLIENT_ID', 'CLIENT_SECRET');

const users = await sdk.users.listUsers();
```

## Error Handling

```typescript
import { IthbatError } from '@ithbatiam/sdk';

try {
  await sdk.users.createUser(userData);
} catch (error) {
  if (error instanceof IthbatError) {
    console.error('Error:', error.message);
    console.error('Code:', error.code);

    if (sdk.isValidationError(error)) {
      sdk.getValidationErrors(error).forEach(detail => {
        console.error(`${detail.field}: ${detail.message}`);
      });
    }
  }
}
```

## Available APIs

### Authentication
```typescript
sdk.auth.login(credentials)
sdk.auth.register(data)
sdk.auth.me()
sdk.auth.verifyMfa({ mfaToken, code })
sdk.auth.verifyBackupCode({ mfaToken, code })
sdk.auth.clientCredentials(clientId, clientSecret, scope?)
sdk.auth.refreshToken({ refreshToken })
sdk.auth.resetPassword({ email })
sdk.auth.changePassword({ currentPassword, newPassword })
```

### Users
```typescript
sdk.users.listUsers(params?)       // → PagedResult<User>
sdk.users.getUser(id)
sdk.users.createUser(data)
sdk.users.updateUser(id, data)
sdk.users.deleteUser(id)
sdk.users.suspendUser(id)
sdk.users.reactivateUser(id)
sdk.users.assignRole(userId, roleId)
sdk.users.removeRole(userId, roleId)
```

### Roles
```typescript
sdk.roles.listRoles(params?)       // → PagedResult<Role>
sdk.roles.getRole(id)
sdk.roles.createRole(data)
sdk.roles.updateRole(id, data)
sdk.roles.deleteRole(id)
sdk.roles.listPermissions()
```

### Groups
```typescript
sdk.groups.listGroups(params?)     // → PagedResult<Group>
sdk.groups.getGroup(id)
sdk.groups.createGroup(data)
sdk.groups.updateGroup(id, data)
sdk.groups.deleteGroup(id)
sdk.groups.listGroupMembers(id)    // → PagedResult<GroupMember>
sdk.groups.addGroupMember(groupId, userId)
sdk.groups.removeGroupMember(groupId, userId)
```

### Tenants
```typescript
sdk.tenants.listTenants(params?)   // → PagedResult<Tenant>
sdk.tenants.getTenant(id)
sdk.tenants.getCurrentTenant()
sdk.tenants.createTenant(data)
sdk.tenants.updateTenant(id, data)
sdk.tenants.deleteTenant(id)
sdk.tenants.getEnabledFeatures()
```

### Sessions
```typescript
sdk.sessions.listSessions()        // → PagedResult<Session>
sdk.sessions.revokeSession(id)
sdk.sessions.revokeAllOtherSessions()
```

### MFA
```typescript
sdk.mfa.setup({ method })
sdk.mfa.verifySetup({ code })
sdk.mfa.disable({ code })
sdk.mfa.regenerateBackupCodes({ code })
sdk.mfa.setupSMS({ phoneNumber })
sdk.mfa.verifySMSSetup({ code })
sdk.mfa.sendSMSOTP()
sdk.mfa.disableSMS({ code })
```

### Audit
```typescript
sdk.audit.listEvents(params?)      // → PagedResult<AuditEvent>
sdk.audit.getEvent(id)
sdk.audit.getLoginHistory(params?)
sdk.audit.getMyActivity(params?)
sdk.audit.getMyLoginHistory(params?)
sdk.audit.getUserActivity(userId, params?)
sdk.audit.getUserLoginHistory(userId, params?)
sdk.audit.getResourceHistory(resourceType, resourceId, params?)
```

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

## Multi-Tenant Context

```typescript
sdk.setTenantId('tenant-1');
const t1Users = await sdk.users.listUsers();

sdk.setTenantId('tenant-2');
const t2Users = await sdk.users.listUsers();
```

## Next Steps

- Read the [full documentation](./SDK_DOCUMENTATION.md)
- Check out [usage examples](./src/lib/examples/basic-usage.example.ts)

## Support

- Issues: [GitHub Issues](https://github.com/ithbatiam/sdk/issues)
- Email: support@ithbat.io
