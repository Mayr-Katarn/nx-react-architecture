import { makeAutoObservable } from 'mobx';
import type { RootStore } from './root.store';

/**
 * Тип технического экрана
 */
export type TechScreenType = 'maintenance' | 'update' | 'error' | 'custom';

/**
 * Конфигурация технического экрана
 */
export interface TechScreenConfig {
  type: TechScreenType;
  title?: string;
  message?: string;
  /** Показывать кнопку повторной попытки */
  showRetry?: boolean;
  /** Callback при нажатии retry */
  onRetry?: () => void;
  /** Дополнительные данные */
  data?: Record<string, unknown>;
}

/**
 * TechScreenStore — управление техническими экранами (верхний слой).
 *
 * Технические экраны блокируют всё приложение и показываются
 * поверх всего контента (включая модалки и алерты).
 *
 * @example
 * ```tsx
 * const { techScreenStore } = useRootStore();
 *
 * // Показать экран техработ
 * techScreenStore.show({
 *   type: 'maintenance',
 *   message: 'Плановые работы до 18:00'
 * });
 *
 * // Скрыть
 * techScreenStore.hide();
 * ```
 */
export class TechScreenStore {
  readonly rootStore: RootStore;

  /**
   * Активен ли технический экран
   */
  isActive = false;

  /**
   * Текущая конфигурация
   */
  config: TechScreenConfig | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  /**
   * Тип текущего экрана
   */
  get type(): TechScreenType | null {
    return this.config?.type ?? null;
  }

  /**
   * Заголовок экрана
   */
  get title(): string | undefined {
    return this.config?.title;
  }

  /**
   * Сообщение экрана
   */
  get message(): string | undefined {
    return this.config?.message;
  }

  /**
   * Показать технический экран
   */
  show(config: TechScreenConfig): void {
    this.config = config;
    this.isActive = true;
  }

  /**
   * Показать экран техобслуживания
   */
  showMaintenance(message?: string): void {
    this.show({
      type: 'maintenance',
      message,
    });
  }

  /**
   * Показать экран обновления
   */
  showUpdate(message?: string): void {
    this.show({
      type: 'update',
      message,
      showRetry: true,
      onRetry: () => window.location.reload(),
    });
  }

  /**
   * Показать экран ошибки
   */
  showError(message?: string, onRetry?: () => void): void {
    this.show({
      type: 'error',
      message,
      showRetry: !!onRetry,
      onRetry,
    });
  }

  /**
   * Скрыть технический экран
   */
  hide(): void {
    this.isActive = false;
    this.config = null;
  }

  /**
   * Вызвать retry callback
   */
  retry(): void {
    if (this.config?.onRetry) {
      this.config.onRetry();
    }
  }
}
