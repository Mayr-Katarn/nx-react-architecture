import type { ComponentType } from 'react';
import { create } from 'zustand';

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
 * Состояние модального store
 */
interface ModalState {
  /** Очередь модальных окон */
  modals: ModalConfig<Record<string, unknown>>[];
}

/**
 * Действия модального store
 */
interface ModalActions {
  /** Открыть модальное окно */
  open: <TProps = Record<string, unknown>>(config: ModalConfig<TProps>) => void;
  /** Закрыть модальное окно по id */
  close: (id: ModalType | string) => void;
  /** Закрыть текущую модалку */
  closeCurrent: () => void;
  /** Закрыть все модалки */
  closeAll: () => void;
  /** Проверить, открыта ли модалка */
  isOpen: (id: ModalType | string) => boolean;
  /** Обработка нажатия Escape */
  handleEscape: () => void;
  /** Обработка клика по overlay */
  handleOverlayClick: () => void;
}

/**
 * Полный тип store
 */
type ModalStore = ModalState & ModalActions;

/**
 * Вычисляет текущую активную модалку (с наивысшим приоритетом)
 */
export const getCurrentModal = (
  modals: ModalConfig<Record<string, unknown>>[],
): ModalConfig | null => {
  if (modals.length === 0) return null;

  // Сортировка по приоритету (desc)
  const sorted = [...modals].sort(
    (a, b) =>
      (b.priority ?? ModalPriority.NORMAL) -
      (a.priority ?? ModalPriority.NORMAL),
  );

  return sorted[0] ?? null;
};

/**
 * useModalStore — Zustand store для управления модальными окнами с приоритетами.
 *
 * Модалки с более высоким приоритетом показываются поверх других.
 * В один момент времени видна только одна модалка (с наивысшим приоритетом).
 *
 * @example
 * ```tsx
 * import { useModalStore, getCurrentModal, ModalType, ModalPriority } from '@nx-react-architecture/core';
 *
 * function MyComponent() {
 *   const { open, close } = useModalStore();
 *   const currentModal = useModalStore((state) => getCurrentModal(state.modals));
 *
 *   // Открыть модалку со стандартным типом
 *   const handleOpen = () => {
 *     open({
 *       id: ModalType.CONFIRM,
 *       component: ConfirmModal,
 *       props: { title: 'Delete item?' },
 *       priority: ModalPriority.HIGH,
 *     });
 *   };
 *
 *   // Закрыть конкретную
 *   const handleClose = () => close(ModalType.CONFIRM);
 *
 *   return <button onClick={handleOpen}>Open Modal</button>;
 * }
 * ```
 */
export const useModalStore = create<ModalStore>()((set, get) => ({
  // State
  modals: [],

  // Actions
  open: (config) => {
    const { modals } = get();

    // Проверить, не открыта ли уже модалка с таким id
    if (modals.some((m) => m.id === config.id)) {
      console.warn(`Modal with id "${config.id}" is already open`);
      return;
    }

    const normalizedConfig = {
      ...config,
      priority: config.priority ?? ModalPriority.NORMAL,
      closeOnOverlay: config.closeOnOverlay ?? true,
      closeOnEscape: config.closeOnEscape ?? true,
    } as ModalConfig<Record<string, unknown>>;

    set({
      modals: [...modals, normalizedConfig],
    });
  },

  close: (id) => {
    const { modals } = get();
    const modal = modals.find((m) => m.id === id);

    if (modal) {
      modal.onClose?.();
      set({ modals: modals.filter((m) => m.id !== id) });
    }
  },

  closeCurrent: () => {
    const { modals, close } = get();
    const current = getCurrentModal(modals);
    if (current) {
      close(current.id);
    }
  },

  closeAll: () => {
    const { modals } = get();
    modals.forEach((m) => {
      m.onClose?.();
    });
    set({ modals: [] });
  },

  isOpen: (id) => {
    return get().modals.some((m) => m.id === id);
  },

  handleEscape: () => {
    const { modals, close } = get();
    const current = getCurrentModal(modals);
    if (current?.closeOnEscape) {
      close(current.id);
    }
  },

  handleOverlayClick: () => {
    const { modals, close } = get();
    const current = getCurrentModal(modals);
    if (current?.closeOnOverlay) {
      close(current.id);
    }
  },
}));
