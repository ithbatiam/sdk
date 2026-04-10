# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.x.x   | Yes       |

## Reporting a Vulnerability

**Do not report security vulnerabilities through public GitHub issues.**

Email **security@ithbat.io** with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

You will receive a response within 48 hours. If confirmed, we will issue a patch and credit you in the release notes (unless you prefer to remain anonymous).

## Security Considerations

The `@ithbatiam/sdk` makes authenticated HTTPS requests to the Ithbat IAM API. Ensure:
- Your API keys and tokens are stored securely (environment variables, secret managers)
- Never embed credentials in client-side code
- Use short-lived tokens and refresh token rotation in production
