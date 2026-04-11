import { IthbatConfig, RequestOptions, ApiError } from './config';

export class HttpClient {
  private config: IthbatConfig;

  constructor(config: IthbatConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };
  }

  setAccessToken(token: string): void {
    this.config.accessToken = token;
  }

  setTenantId(tenantId: string): void {
    this.config.tenantId = tenantId;
  }

  getBaseOrigin(): string {
    try {
      return new URL(this.config.basePath).origin;
    } catch {
      return this.config.basePath;
    }
  }

  async formRequest<T>(urlOrPath: string, body: Record<string, string>): Promise<T> {
    const url = urlOrPath.startsWith('http') ? urlOrPath : this.buildUrl(urlOrPath);
    const headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers.set('Accept', 'application/json');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: new URLSearchParams(body).toString(),
        signal: AbortSignal.timeout(this.config.timeout!),
      });

      if (!response.ok) {
        await this.throwFromResponse(response);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof IthbatError) throw error;
      if (error instanceof Error) {
        throw new IthbatError(error.message, 0, 'NETWORK_ERROR', [{ message: error.message }]);
      }
      throw error;
    }
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const url = this.buildUrl(options.path, options.params);
    const headers = this.buildHeaders(options.headers);

    const fetchOptions: RequestInit = {
      method: options.method,
      headers,
      signal: AbortSignal.timeout(this.config.timeout!),
    };

    if (options.body && options.method !== 'GET') {
      fetchOptions.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        await this.throwFromResponse(response);
      }

      if (response.status === 204) {
        return {} as T;
      }

      const raw = await response.json();
      const data = raw && typeof raw === 'object' && 'data' in raw ? raw.data : raw;
      return data as T;
    } catch (error) {
      if (error instanceof IthbatError) throw error;
      if (error instanceof Error) {
        throw new IthbatError(error.message, 0, 'NETWORK_ERROR', [{ message: error.message }]);
      }
      throw error;
    }
  }

  private async throwFromResponse(response: Response): Promise<never> {
    let errorBody: ApiError | null = null;
    try {
      errorBody = (await response.json()) as ApiError;
    } catch {
      throw new IthbatError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        'HTTP_ERROR',
        [{ message: response.statusText }]
      );
    }
    throw new IthbatError(
      errorBody!.error?.message ?? 'Request failed',
      response.status,
      errorBody!.error?.code ?? 'ERROR',
      errorBody!.error?.details
    );
  }

  private buildUrl(path: string, params?: unknown): string {
    const baseUrl = this.config.basePath.endsWith('/')
      ? this.config.basePath.slice(0, -1)
      : this.config.basePath;

    const fullPath = path.startsWith('/') ? path : `/${path}`;
    let url = `${baseUrl}${fullPath}`;

    if (params && typeof params === 'object') {
      const queryString = Object.entries(params as Record<string, unknown>)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`).join('&');
          }
          return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
        })
        .join('&');

      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }

  private buildHeaders(additionalHeaders?: Record<string, string>): Headers {
    const headers = new Headers();

    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    if (this.config.accessToken) {
      headers.set('Authorization', `Bearer ${this.config.accessToken}`);
    }

    if (this.config.tenantId) {
      headers.set('X-Tenant-ID', this.config.tenantId);
    }

    if (this.config.headers) {
      Object.entries(this.config.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    if (additionalHeaders) {
      Object.entries(additionalHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    return headers;
  }
}

export class IthbatError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: Array<{ field?: string; message: string }>
  ) {
    super(message);
    this.name = 'IthbatError';
    Object.setPrototypeOf(this, IthbatError.prototype);
  }
}
