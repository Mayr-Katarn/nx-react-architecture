import { makeAutoObservable } from 'mobx';
import type { RootStore } from './root.store';

/**
 * Тип алерта
 */
export type AlertType = 'success' | 'error' | 'warning' | 'info';

/**
 * Конфигурация алерта
 */
export interface AlertConfig {
  /** Уникальный идентификатор */
  id: string;
  /** Сообщение */
  message: string;
  /** Тип алерта */
  type: AlertType;
  /** Время показа в мс (0 = бесконечно) */
  duration: number;
  /** Можно ли закрыть вручную */
  dismissible: boolean;
  /** Timestamp создания */
  createdAt: number;
}

/**
 * AlertStore — управление алертами/уведомлениями.
 *
 * @example
 * ```tsx
 * const { alertStore } = useRootStore();
 *
 * // Показать success алерт на 3 секунды
 * alertStore.success('Сохранено!');
 *
 * // Показать error алерт без автоскрытия
 * alertStore.error('Ошибка сети', 0);
 *
 * // Скрыть алерт
 * alertStore.dismiss(alertId);
 * ```
 */
export class AlertStore {
  readonly rootStore: RootStore;

  /**
   * Список активных алертов
   */
  alerts: AlertConfig[] = [];

  /**
   * Максимальное количество алертов
   */
  maxAlerts = 5;

  /**
   * Длительность по умолчанию (мс)
   */
  defaultDuration = 5000;

  /**
   * Таймеры автоскрытия
   */
  private timers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  /**
   * Показать алерт
   */
  show(
    message: string,
    type: AlertType = 'info',
    duration?: number
  ): string {
    const id = this.generateId();
    const alert: AlertConfig = {
      id,
      message,
      type,
      duration: duration ?? this.defaultDuration,
      dismissible: true,
      createdAt: Date.now(),
    };

    // Добавить в начало списка
    this.alerts.unshift(alert);

    // Удалить старые, если превышен лимит
    if (this.alerts.length > this.maxAlerts) {
      const removed = this.alerts.pop();
      if (removed) {
        this.clearTimer(removed.id);
      }
    }

    // Установить таймер автоскрытия
    if (alert.duration > 0) {
      this.setTimer(id, alert.duration);
    }

    return id;
  }

  /**
   * Показать success алерт
   */
  success(message: string, duration?: number): string {
    return this.show(message, 'success', duration);
  }

  /**
   * Показать error алерт
   */
  error(message: string, duration?: number): string {
    return this.show(message, 'error', duration ?? 0);
  }

  /**
   * Показать warning алерт
   */
  warning(message: string, duration?: number): string {
    return this.show(message, 'warning', duration);
  }

  /**
   * Показать info алерт
   */
  info(message: string, duration?: number): string {
    return this.show(message, 'info', duration);
  }

  /**
   * Скрыть алерт
   */
  dismiss(id: string): void {
    this.clearTimer(id);
    this.alerts = this.alerts.filter((a) => a.id !== id);
  }

  /**
   * Скрыть все алерты
   */
  dismissAll(): void {
    this.timers.forEach((_, id) => this.clearTimer(id));
    this.alerts = [];
  }

  /**
   * Есть ли активные алерты
   */
  get hasAlerts(): boolean {
    return this.alerts.length > 0;
  }

  /**
   * Количество алертов
   */
  get count(): number {
    return this.alerts.length;
  }

  private generateId(): string {
    return `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private setTimer(id: string, duration: number): void {
    const timer = setTimeout(() => {
      this.dismiss(id);
    }, duration);
    this.timers.set(id, timer);
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }
}
