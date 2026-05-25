# Changelog

All notable changes to `@ithbatiam/sdk` are documented in this file. This project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.8] - 2026-05-26

### Fixed
- `isTokenExpired()` now reads the live access token set via `setAccessToken()` instead of only the construction-time token, so proactive token-refresh logic behaves as documented.
- `changePassword()` now sends the backend's `current_password` / `new_password` contract (previously sent `oldPassword` / `newPassword`, which the API rejected).

### Security
- Enforce HTTPS for `basePath` outside `localhost`: a plaintext `http://` base now throws `INSECURE_BASE_PATH` rather than transmitting tokens in the clear.
- `clientCredentials()` / `authenticate()` throw `BROWSER_CONTEXT_FORBIDDEN` when called in a browser, preventing the M2M client secret from being shipped in front-end bundles.
- Encode all interpolated URL path segments (`encodeURIComponent`), neutralising path-injection / traversal via untrusted ids.
- `IthbatError.toJSON()` serializes only safe fields, so bearer tokens never leak through error logging.

### Changed
- **Breaking:** `ChangePasswordRequest.oldPassword` renamed to `currentPassword`.
- Documentation now teaches in-memory access tokens + httpOnly-cookie / BFF refresh storage instead of `localStorage`.
- Removed documentation for methods that do not exist (`getUserRoles`, `upgradePlan`, `listGroupMembers`, `listSessions`).

### Internal
- Added unit tests across all API modules plus security reject-tests; raised coverage above 90% and added a `coverageThreshold` gate (≥85% lines, ≥80% branches).
- Added `.gitattributes` to pin LF line endings.

## [0.1.7] - 2026-04-01

- Initial published release: typed client for the Ithbat IAM platform, zero runtime dependencies, Node 18/20/22/24 CI matrix.
