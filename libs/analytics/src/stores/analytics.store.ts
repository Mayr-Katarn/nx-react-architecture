import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';
import type {
  AnalyticsConfig,
  AnalyticsEvent,
  AnalyticsEventData,
  AnalyticsProvider,
  UserIdentity,
} from '../types';

/**
 * AnalyticsStore — MobX store для управления аналитикой.
 *
 * @example
 * ```tsx
 * const analytics = new AnalyticsStore({
 *   providers: [new ConsoleAnalyticsProvider()],
 *   config: { debug: true }
 * });
 *
 * analytics.track('button_click', { buttonId: 'submit' });
 * analytics.identify('user-123', { plan: 'premium' });
 * ```
 */
export class AnalyticsStore {
  /**
   * Провайдеры аналитики
   */
  private providers: AnalyticsProvider[] = [];

  /**
   * Конфигурация
   */
  private config: AnalyticsConfig;

  /**
   * Идентифицированный пользователь
   */
  private currentUserId: string | null = null;

  /**
   * История событий (для отладки)
   */
  private eventHistory: AnalyticsEvent[] = [];

  /**
   * Максимальный размер истории
   */
  private maxHistorySize = 100;

  constructor(options?: {
    providers?: AnalyticsProvider[];
    config?: AnalyticsConfig;
  }) {
    this.providers = options?.providers ?? [];
    this.config = {
      enabled: true,
      debug: false,
      globalProperties: {},
      ...options?.config,
    };

    makeAutoObservable(this, undefined, { autoBind: true });
  }

  /**
   * Инициализация всех провайдеров
   */
  async init(): Promise<void> {
    for (const provider of this.providers) {
      if (provider.init) {
        await provider.init();
      }
      if (this.config.globalProperties) {
        provider.setGlobalProperties?.(this.config.globalProperties);
      }
    }
  }

  /**
   * Добавить провайдер
   */
  addProvider(provider: AnalyticsProvider): void {
    this.providers.push(provider);
    if (this.config.globalProperties) {
      provider.setGlobalProperties?.(this.config.globalProperties);
    }
  }

  /**
   * Удалить провайдер
   */
  removeProvider(name: string): void {
    this.providers = this.providers.filter((p) => p.name !== name);
  }

  /**
   * Отправить событие
   */
  track(eventName: string, data?: AnalyticsEventData): void {
    if (!this.config.enabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      data,
      timestamp: Date.now(),
    };

    // Сохранить в историю
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Отправить во все провайдеры
    for (const provider of this.providers) {
      try {
        provider.track(event);
      } catch (error) {
        if (this.config.debug) {
          console.error(`Analytics error (${provider.name}):`, error);
        }
      }
    }
  }

  /**
   * Идентифицировать пользователя
   */
  identify(userId: string, traits?: Record<string, unknown>): void {
    if (!this.config.enabled) return;

    this.currentUserId = userId;

    const identity: UserIdentity = { userId, traits };

    for (const provider of this.providers) {
      try {
        provider.identify(identity);
      } catch (error) {
        if (this.config.debug) {
          console.error(`Analytics identify error (${provider.name}):`, error);
        }
      }
    }
  }

  /**
   * Сбросить идентификацию
   */
  reset(): void {
    this.currentUserId = null;

    for (const provider of this.providers) {
      try {
        provider.reset?.();
      } catch (error) {
        if (this.config.debug) {
          console.error(`Analytics reset error (${provider.name}):`, error);
        }
      }
    }
  }

  /**
   * Установить глобальные свойства
   */
  setGlobalProperties(properties: Record<string, unknown>): void {
    this.config.globalProperties = {
      ...this.config.globalProperties,
      ...properties,
    };

    for (const provider of this.providers) {
      provider.setGlobalProperties?.(this.config.globalProperties);
    }
  }

  /**
   * Включить/выключить аналитику
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /**
   * Получить текущий userId
   */
  get userId(): string | null {
    return this.currentUserId;
  }

  /**
   * Получить историю событий
   */
  get history(): AnalyticsEvent[] {
    return [...this.eventHistory];
  }

  /**
   * Очистить историю
   */
  clearHistory(): void {
    this.eventHistory = [];
  }
}

// React Context
const AnalyticsContext = createContext<AnalyticsStore | null>(null);

/**
 * Provider для AnalyticsStore
 */
export const AnalyticsProvider = AnalyticsContext.Provider;

/**
 * Hook для доступа к AnalyticsStore
 */
export function useAnalytics(): AnalyticsStore {
  const store = useContext(AnalyticsContext);
  if (!store) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return store;
}
