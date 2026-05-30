# Changelog

All notable changes to `@ithbatiam/sdk` are documented in this file. This project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.8] - 2026-05-29

### Fixed
- All paginated list methods (`listUsers`, `listRoles`, `listGroups`, `getGroupMembers`, `listTenants`, `getMySessions`, `getUserSessions`, and every `audit.*` history method) now return a populated `PagedResult`. Previously the backend's `{ data: [...], meta: { pagination } }` envelope was returned as a bare array mistyped as `PagedResult`, so `.items` and the pagination fields were always `undefined`. A new `HttpClient.requestPaged()` folds `data` into `items` and lifts `meta.pagination`.
- `isTokenExpired()` now reads the live access token set via `setAccessToken()` instead of only the construction-time token, so proactive token-refresh logic behaves as documented.
- `changePassword()` now sends the backend's `current_password` / `new_password` contract (previously sent `oldPassword` / `newPassword`, which the API rejected).

### Security
- Enforce HTTPS for `basePath` outside `localhost`: a plaintext `http://` base now throws `INSECURE_BASE_PATH` rather than transmitting tokens in the clear.
- `clientCredentials()` / `authenticate()` throw `BROWSER_CONTEXT_FORBIDDEN` when called in a browser, preventing the M2M client secret from being shipped in front-end bundles.
- Encode all interpolated URL path segments (`encodeURIComponent`), neutralising path-injection / traversal via untrusted ids.
- `IthbatError.toJSON()` serializes only safe fields, so bearer tokens never leak through error logging.

### Changed
- **Breaking:** `ChangePasswordRequest.oldPassword` renamed to `currentPassword`.
- **Breaking:** `tenants.getEnabledFeatures(): { features: string[] }` renamed to `tenants.getFeatures(): TenantFeature[]`, matching the real `/tenant/features` response (`{ name, enabled, source }[]`). New `TenantFeature` type is exported.
- `IthbatSDK` now exposes `getAccessToken()`, symmetric with `setAccessToken()`.
- Documentation now teaches in-memory access tokens + httpOnly-cookie / BFF refresh storage instead of `localStorage`.
- Removed documentation for methods that do not exist (`getUserRoles`, `upgradePlan`, `listGroupMembers`, `listSessions`).

### Internal
- Added unit tests across all API modules plus security reject-tests; raised coverage above 90% and added a `coverageThreshold` gate (≥85% lines, ≥80% branches).
- Added `requestPaged` unit tests (envelope folding, missing-meta defaults, non-array data, 204, error passthrough) and a facade access-token accessor test.
- Verified the entire SDK surface against a live backend — all 8 namespaces, full user/role/group CRUD lifecycle, guard, auth, and error-shape paths.
- Added `.gitattributes` to pin LF line endings.

## [0.1.7] - 2026-04-01

- Initial published release: typed client for the Ithbat IAM platform, zero runtime dependencies, Node 18/20/22/24 CI matrix.
