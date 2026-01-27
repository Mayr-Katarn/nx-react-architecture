import type {
  ApiClientConfig,
  ApiResponse,
  ErrorInterceptor,
  HttpMethod,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from '../types';
import { ApiError } from '../types';

/**
 * ApiClient — базовый HTTP клиент с поддержкой интерцепторов.
 *
 * @example
 * ```ts
 * const api = new ApiClient({ baseUrl: 'https://api.example.com' });
 *
 * // GET запрос
 * const users = await api.get<User[]>('/users');
 *
 * // POST запрос
 * const newUser = await api.post<User>('/users', { name: 'John' });
 *
 * // С параметрами
 * const filtered = await api.get<User[]>('/users', {
 *   params: { role: 'admin' }
 * });
 * ```
 */
export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly defaultTimeout: number;

  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };
    this.defaultTimeout = config.timeout ?? 30000;
  }

  /**
   * Добавить интерцептор запроса
   */
  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor);
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index > -1) this.requestInterceptors.splice(index, 1);
    };
  }

  /**
   * Добавить интерцептор ответа
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor);
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index > -1) this.responseInterceptors.splice(index, 1);
    };
  }

  /**
   * Добавить интерцептор ошибки
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    this.errorInterceptors.push(interceptor);
    return () => {
      const index = this.errorInterceptors.indexOf(interceptor);
      if (index > -1) this.errorInterceptors.splice(index, 1);
    };
  }

  /**
   * GET запрос
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>('GET', endpoint, undefined, config);
    return response.data;
  }

  /**
   * POST запрос
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.request<T>('POST', endpoint, body, config);
    return response.data;
  }

  /**
   * PUT запрос
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.request<T>('PUT', endpoint, body, config);
    return response.data;
  }

  /**
   * PATCH запрос
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.request<T>('PATCH', endpoint, body, config);
    return response.data;
  }

  /**
   * DELETE запрос
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>('DELETE', endpoint, undefined, config);
    return response.data;
  }

  /**
   * Выполнить запрос
   */
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    let requestConfig = {
      url: this.buildUrl(endpoint, config?.params),
      method,
      ...config,
    };

    // Применить интерцепторы запроса
    for (const interceptor of this.requestInterceptors) {
      requestConfig = interceptor(requestConfig);
    }

    const controller = new AbortController();
    const timeout = config?.timeout ?? this.defaultTimeout;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(requestConfig.url, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...requestConfig.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: config?.signal ?? controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }

        const error = new ApiError(
          `Request failed: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
          errorData
        );

        // Применить интерцепторы ошибки
        for (const interceptor of this.errorInterceptors) {
          const result = interceptor(error);
          if (result) throw result;
        }

        throw error;
      }

      let data: T;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      let apiResponse: ApiResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };

      // Применить интерцепторы ответа
      for (const interceptor of this.responseInterceptors) {
        apiResponse = interceptor(apiResponse) as ApiResponse<T>;
      }

      return apiResponse;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'Request Timeout');
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        0,
        'Network Error'
      );
    }
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(endpoint.startsWith('/') ? endpoint.slice(1) : endpoint, this.baseUrl + '/');

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }
}
