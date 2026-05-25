import { IthbatError } from './http-client';

export function isBrowser(): boolean {
  const g = globalThis as { window?: { document?: unknown } };
  return typeof g.window?.document !== 'undefined';
}

export function assertNotBrowser(operation: string): void {
  if (isBrowser()) {
    throw new IthbatError(
      `${operation} must not be called in a browser: it requires a client secret that would be exposed to end users. Use it only in a trusted server context.`,
      0,
      'BROWSER_CONTEXT_FORBIDDEN'
    );
  }
}
