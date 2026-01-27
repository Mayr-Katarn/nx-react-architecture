/**
 * Данные события аналитики
 */
export type AnalyticsEventData = Record<string, unknown>;

/**
 * Событие аналитики
 */
export interface AnalyticsEvent {
  name: string;
  data?: AnalyticsEventData;
  timestamp: number;
}

/**
 * Данные пользователя для идентификации
 */
export interface UserIdentity {
  userId: string;
  traits?: Record<string, unknown>;
}

/**
 * Интерфейс провайдера аналитики
 */
export interface AnalyticsProvider {
  /**
   * Название провайдера
   */
  readonly name: string;

  /**
   * Инициализация провайдера
   */
  init?(): Promise<void> | void;

  /**
   * Отправить событие
   */
  track(event: AnalyticsEvent): void;

  /**
   * Идентифицировать пользователя
   */
  identify(identity: UserIdentity): void;

  /**
   * Сбросить идентификацию
   */
  reset?(): void;

  /**
   * Установить глобальные свойства
   */
  setGlobalProperties?(properties: Record<string, unknown>): void;
}

/**
 * Конфигурация аналитики
 */
export interface AnalyticsConfig {
  /**
   * Включена ли аналитика
   */
  enabled?: boolean;

  /**
   * Режим отладки
   */
  debug?: boolean;

  /**
   * Глобальные свойства, добавляемые к каждому событию
   */
  globalProperties?: Record<string, unknown>;
}
