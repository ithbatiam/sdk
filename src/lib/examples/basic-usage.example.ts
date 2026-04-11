import { IthbatSDK, IthbatError } from '../..';

const sdk = new IthbatSDK({
  basePath: 'https://api.ithbat.io/api/v1',
  tenantId: 'your-tenant-id',
});

// ============================================================================
// Example 2: Authentication Flow
// ============================================================================

async function loginExample() {
  try {
    const loginResponse = await sdk.auth.login({
      email: 'user@example.com',
      password: 'your-password',
      rememberMe: true,
    });

    sdk.setAccessToken(loginResponse.accessToken!);

    // SECURITY: Do NOT store the refresh token in localStorage or any
    // JavaScript-accessible storage — it is vulnerable to XSS attacks.
    //
    // The correct pattern is to proxy the login through YOUR backend, which
    // sets the refresh token as an httpOnly cookie. JavaScript never touches
    // the refresh token at all. See the server-side example below.

  } catch (error) {
    if (error instanceof IthbatError) {
      throw new Error(`Login failed [${error.code}]: ${error.message}`);
    }
    throw error;
  }
}

// ============================================================================
// Example 3: Secure Refresh Token Storage via httpOnly Cookie (Server-Side)
//
// httpOnly cookies cannot be set by JavaScript — only by a server via the
// Set-Cookie response header. Your backend acts as a proxy: it calls the
// Ithbat API, receives the refresh token, and stores it in a cookie that
// the browser sends automatically but JS can never read.
//
// Pseudocode using Express.js — adapt to your framework:
//
//   import express from 'express';
//   const server = express();
//   const ithbat = new IthbatSDK({ basePath: '...', tenantId: '...' });
//
//   // POST /api/login  ← your frontend calls this, not the Ithbat API directly
//   server.post('/api/login', async (req, res) => {
//     const response = await ithbat.auth.login(req.body);
//
//     // Store the refresh token in an httpOnly cookie — JS cannot read this
//     res.cookie('refreshToken', response.refreshToken, {
//       httpOnly: true,   // invisible to JavaScript
//       secure: true,     // HTTPS only
//       sameSite: 'strict',
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//       path: '/api/refresh',             // restrict cookie scope
//     });
//
//     // Return only the short-lived access token to the frontend
//     res.json({ accessToken: response.accessToken, user: response.user });
//   });
//
//   // POST /api/refresh  ← frontend calls this when access token expires
//   server.post('/api/refresh', async (req, res) => {
//     const refreshToken = req.cookies.refreshToken; // browser sends it automatically
//     if (!refreshToken) return res.status(401).json({ error: 'No session' });
//
//     const response = await ithbat.auth.refreshToken({ refreshToken });
//
//     // Rotate the refresh token cookie
//     res.cookie('refreshToken', response.refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'strict',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       path: '/api/refresh',
//     });
//
//     res.json({ accessToken: response.accessToken });
//   });
//
//   // POST /api/logout
//   server.post('/api/logout', async (req, res) => {
//     await ithbat.auth.logout();
//     res.clearCookie('refreshToken', { path: '/api/refresh' });
//     res.json({ success: true });
//   });
// ============================================================================

async function refreshTokenExample(refreshToken: string) {
  try {
    const response = await sdk.auth.refreshToken({ refreshToken });
    sdk.setAccessToken(response.accessToken);
    return response.refreshToken;
  } catch (error) {
    throw error;
  }
}

// ============================================================================
// Example 4: User Management
// ============================================================================

async function userManagementExample() {
  await sdk.users.listUsers({
    page: 1,
    limit: 20,
    search: 'john',
    isActive: true,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const user = await sdk.users.getUser('user-id-123');

  const newUser = await sdk.users.createUser({
    email: 'newuser@example.com',
    firstName: 'John',
    familyName: 'Doe',
    sendInvite: true,
  });

  await sdk.users.updateUser(newUser.id, { firstName: 'Jane' });
  await sdk.users.assignRole(user.id, 'role-id-456');
}

// ============================================================================
// Example 5: Tenant Management
// ============================================================================

async function tenantManagementExample() {
  const currentTenant = await sdk.tenants.getCurrentTenant();

  await sdk.tenants.updateTenant(currentTenant.id, {
    name: 'Updated Tenant Name',
    settings: {
      locale: 'en',
      timezone: 'America/New_York',
      theme: {
        primaryColor: '#0B7285',
        logo: 'https://example.com/logo.png',
      },
    },
  });
}

// ============================================================================
// Example 6: Role Management
// ============================================================================

async function roleManagementExample() {
  await sdk.roles.listRoles({ page: 1, limit: 50 });

  await sdk.roles.createRole({
    name: 'Content Editor',
    description: 'Can create and edit content',
    permissions: ['content:read', 'content:write', 'content:delete'],
  });

  await sdk.roles.listPermissions();
}

// ============================================================================
// Example 7: Error Handling
// ============================================================================

async function errorHandlingExample() {
  try {
    await sdk.users.getUser('invalid-id');
  } catch (error) {
    if (error instanceof IthbatError) {
      switch (error.code) {
        case 'UNAUTHORIZED':
          throw new Error('User not authenticated — redirect to login');
        case 'NOT_FOUND':
          throw new Error('User not found');
        case 'VALIDATION_ERROR':
          throw new Error(`Validation failed: ${JSON.stringify(error.details)}`);
        default:
          throw new Error(`API error: ${error.message}`);
      }
    }
    throw error;
  }
}

// ============================================================================
// Example 8: Multi-Tenant Context
// ============================================================================

async function multiTenantExample() {
  sdk.setTenantId('tenant-2');
  await sdk.users.listUsers();
  sdk.setTenantId('tenant-1');
}

// ============================================================================
// Example 9: Custom Headers
// ============================================================================

new IthbatSDK({
  basePath: 'https://api.ithbat.io/api/v1',
  tenantId: 'your-tenant-id',
  headers: {
    'X-Custom-Header': 'custom-value',
    'X-Request-Source': 'mobile-app',
  },
});

// ============================================================================
// Example 10: Registration Flow
// ============================================================================

async function registrationFlowExample() {
  await sdk.auth.register({
    email: 'newuser@example.com',
    password: 'your-strong-password',
    firstName: 'John',
    familyName: 'Doe',
    tenantId: 'your-tenant-id',
  });

  const verificationToken = 'token-from-email';
  await sdk.auth.verifyEmail(verificationToken);

  const loginResponse = await sdk.auth.login({
    email: 'newuser@example.com',
    password: 'your-strong-password',
  });

  sdk.setAccessToken(loginResponse.accessToken!);
}

export {
  loginExample,
  refreshTokenExample,
  userManagementExample,
  tenantManagementExample,
  roleManagementExample,
  errorHandlingExample,
  multiTenantExample,
  registrationFlowExample,
};
