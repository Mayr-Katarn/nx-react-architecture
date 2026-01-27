/**
 * HTTP методы
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Конфигурация запроса
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  signal?: AbortSignal;
}

/**
 * Ответ API
 */
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * Ошибка API
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Конфигурация API клиента
 */
export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

/**
 * Интерцептор запроса
 */
export type RequestInterceptor = (
  config: RequestConfig & { url: string; method: HttpMethod }
) => RequestConfig & { url: string; method: HttpMethod };

/**
 * Интерцептор ответа
 */
export type ResponseInterceptor<T = unknown> = (
  response: ApiResponse<T>
) => ApiResponse<T>;

/**
 * Интерцептор ошибки
 */
export type ErrorInterceptor = (error: ApiError) => ApiError | void;
