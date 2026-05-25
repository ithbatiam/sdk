import { isBrowser, assertNotBrowser } from '../runtime';
import { IthbatError } from '../http-client';

describe('runtime guards', () => {
  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it('isBrowser is false in a node context', () => {
    expect(isBrowser()).toBe(false);
  });

  it('isBrowser is true when window.document is present', () => {
    (globalThis as { window?: unknown }).window = { document: {} };
    expect(isBrowser()).toBe(true);
  });

  it('isBrowser is false when window exists without a document', () => {
    (globalThis as { window?: unknown }).window = {};
    expect(isBrowser()).toBe(false);
  });

  it('assertNotBrowser is a no-op in a server context', () => {
    expect(() => assertNotBrowser('op')).not.toThrow();
  });

  it('assertNotBrowser throws BROWSER_CONTEXT_FORBIDDEN in a browser', () => {
    (globalThis as { window?: unknown }).window = { document: {} };
    expect(() => assertNotBrowser('clientCredentials')).toThrow(IthbatError);
    try {
      assertNotBrowser('clientCredentials');
    } catch (e) {
      expect((e as IthbatError).code).toBe('BROWSER_CONTEXT_FORBIDDEN');
    }
  });
});
