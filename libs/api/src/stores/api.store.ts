import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';
import { ApiClient } from '../client';
import type { ApiClientConfig } from '../types';

/**
 * ApiStore — MobX store для управления API клиентом.
 *
 * @example
 * ```tsx
 * const apiStore = new ApiStore({ baseUrl: '/api' });
 *
 * // Установить токен авторизации
 * apiStore.setAuthToken('Bearer xxx');
 *
 * // Использовать клиент
 * const users = await apiStore.client.get('/users');
 * ```
 */
export class ApiStore {
  /**
   * API клиент
   */
  readonly client: ApiClient;

  /**
   * Базовый URL
   */
  readonly baseUrl: string;

  /**
   * Токен авторизации
   */
  private authToken: string | null = null;

  /**
   * Флаг онлайн-статуса
   */
  isOnline = true;

  /**
   * Количество активных запросов
   */
  activeRequests = 0;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.client = new ApiClient(config);

    // Интерцептор для добавления auth token
    this.client.addRequestInterceptor((reqConfig) => {
      if (this.authToken) {
        return {
          ...reqConfig,
          headers: {
            ...reqConfig.headers,
            Authorization: this.authToken,
          },
        };
      }
      return reqConfig;
    });

    // Отслеживание онлайн-статуса
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.setOnline(true));
      window.addEventListener('offline', () => this.setOnline(false));
      this.isOnline = navigator.onLine;
    }

    makeAutoObservable(this, undefined, { autoBind: true });
  }

  /**
   * Установить токен авторизации
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  /**
   * Получить токен авторизации
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Проверить наличие токена
   */
  get isAuthenticated(): boolean {
    return this.authToken !== null;
  }

  /**
   * Есть ли активные запросы
   */
  get isLoading(): boolean {
    return this.activeRequests > 0;
  }

  /**
   * Инкремент счётчика запросов
   */
  incrementRequests(): void {
    this.activeRequests++;
  }

  /**
   * Декремент счётчика запросов
   */
  decrementRequests(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
  }

  /**
   * Установить онлайн-статус
   */
  private setOnline(value: boolean): void {
    this.isOnline = value;
  }
}

// React Context
const ApiContext = createContext<ApiStore | null>(null);

/**
 * Provider для ApiStore
 */
export const ApiProvider = ApiContext.Provider;

/**
 * Hook для доступа к ApiStore
 */
export function useApiStore(): ApiStore {
  const store = useContext(ApiContext);
  if (!store) {
    throw new Error('useApiStore must be used within ApiProvider');
  }
  return store;
}

/**
 * Hook для доступа к API клиенту
 */
export function useApi(): ApiClient {
  return useApiStore().client;
}
