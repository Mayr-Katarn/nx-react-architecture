import { makeAutoObservable, observable } from 'mobx';
import type { ComponentType } from 'react';
import type { RootStore } from './root.store';

/**
 * Приоритеты модальных окон
 */
export enum ModalPriority {
  LOW = 0,
  NORMAL = 50,
  HIGH = 100,
  CRITICAL = 200,
}

/**
 * Типы модальных окон (стандартные)
 */
export enum ModalType {
  CONFIRM = 'confirm',
  ALERT = 'alert',
  DELETE = 'delete',
  EDIT = 'edit',
  CREATE = 'create',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  CUSTOM = 'custom',
}

/**
 * Конфигурация модального окна
 */
export interface ModalConfig<TProps = Record<string, unknown>> {
  /** Уникальный идентификатор (стандартный тип или кастомная строка) */
  id: ModalType | string;
  /** React компонент модалки */
  component: ComponentType<TProps & { onClose: () => void }>;
  /** Props для компонента */
  props?: TProps;
  /** Приоритет (чем выше, тем "важнее") */
  priority?: ModalPriority;
  /** Можно ли закрыть по клику на overlay */
  closeOnOverlay?: boolean;
  /** Можно ли закрыть по Escape */
  closeOnEscape?: boolean;
  /** Callback после закрытия */
  onClose?: () => void;
}

/**
 * ModalStore — управление модальными окнами с приоритетами.
 *
 * Модалки с более высоким приоритетом показываются поверх других.
 * В один момент времени видна только одна модалка (с наивысшим приоритетом).
 *
 * @example
 * ```tsx
 * const { modalStore } = useRootStore();
 *
 * // Открыть модалку со стандартным типом
 * modalStore.open({
 *   id: ModalType.CONFIRM,
 *   component: ConfirmModal,
 *   props: { title: 'Delete item?' },
 *   priority: ModalPriority.HIGH,
 * });
 *
 * // Или с кастомным id
 * modalStore.open({
 *   id: 'my-custom-modal',
 *   component: CustomModal,
 *   priority: ModalPriority.NORMAL,
 * });
 *
 * // Закрыть конкретную
 * modalStore.close(ModalType.CONFIRM);
 *
 * // Закрыть все
 * modalStore.closeAll();
 * ```
 */
export class ModalStore {
  readonly rootStore: RootStore;

  /**
   * Очередь модальных окон
   */
  modals: ModalConfig<any>[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(
      this,
      { modals: observable.shallow },
      { autoBind: true },
    );
  }

  /**
   * Текущая активная модалка (с наивысшим приоритетом)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get currentModal(): ModalConfig<any> | null {
    if (this.modals.length === 0) return null;

    // Сортировка по приоритету (desc) и времени добавления
    const sorted = [...this.modals].sort(
      (a, b) =>
        (b.priority ?? ModalPriority.NORMAL) -
        (a.priority ?? ModalPriority.NORMAL),
    );

    return sorted[0] ?? null;
  }

  /**
   * Есть ли открытые модалки
   */
  get hasModals(): boolean {
    return this.modals.length > 0;
  }

  /**
   * Количество модалок в очереди
   */
  get count(): number {
    return this.modals.length;
  }

  /**
   * Открыть модальное окно
   */
  open<TProps = Record<string, unknown>>(config: ModalConfig<TProps>): void {
    // Проверить, не открыта ли уже модалка с таким id
    if (this.modals.some((m) => m.id === config.id)) {
      console.warn(`Modal with id "${config.id}" is already open`);
      return;
    }

    this.modals.push({
      ...config,
      priority: config.priority ?? ModalPriority.NORMAL,
      closeOnOverlay: config.closeOnOverlay ?? true,
      closeOnEscape: config.closeOnEscape ?? true,
    });
  }

  /**
   * Закрыть модальное окно по id
   */
  close(id: ModalType | string): void {
    const modal = this.modals.find((m) => m.id === id);
    if (modal) {
      modal.onClose?.();
      this.modals = this.modals.filter((m) => m.id !== id);
    }
  }

  /**
   * Закрыть текущую модалку
   */
  closeCurrent(): void {
    const current = this.currentModal;
    if (current) {
      this.close(current.id);
    }
  }

  /**
   * Закрыть все модалки
   */
  closeAll(): void {
    this.modals.forEach((m) => {
      m.onClose?.();
    });
    this.modals = [];
  }

  /**
   * Проверить, открыта ли модалка
   */
  isOpen(id: ModalType | string): boolean {
    return this.modals.some((m) => m.id === id);
  }

  /**
   * Обработка нажатия Escape
   */
  handleEscape(): void {
    const current = this.currentModal;
    if (current?.closeOnEscape) {
      this.close(current.id);
    }
  }

  /**
   * Обработка клика по overlay
   */
  handleOverlayClick(): void {
    const current = this.currentModal;
    if (current?.closeOnOverlay) {
      this.close(current.id);
    }
  }
}
