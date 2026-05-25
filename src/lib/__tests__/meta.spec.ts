import { readFileSync } from 'fs';
import { join } from 'path';
import * as sdk from '../../index';
import { AuditApi } from '../apis/audit-api';
import { HttpClient } from '../http-client';

describe('package: zero runtime dependencies (T12)', () => {
  it('declares no runtime dependencies', () => {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
    expect(Object.keys(pkg.dependencies ?? {})).toEqual([]);
  });
});

describe('public API surface', () => {
  it('exports the core entry points', () => {
    expect(sdk.IthbatSDK).toBeDefined();
    expect(sdk.HttpClient).toBeDefined();
    expect(sdk.IthbatError).toBeDefined();
    expect(sdk.AuthApi).toBeDefined();
    expect(sdk.AuditApi).toBeDefined();
  });

  it('AuditApi exposes getStats (RM-002)', () => {
    const audit = new AuditApi({ request: jest.fn() } as unknown as HttpClient);
    expect(typeof audit.getStats).toBe('function');
  });
});
