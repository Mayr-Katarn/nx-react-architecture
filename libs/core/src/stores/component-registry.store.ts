import { makeAutoObservable } from 'mobx';
import type { RootStore } from './root.store';

/**
 * Позиция компонента
 */
export interface ComponentPosition {
  x: number;
  y: number;
}

/**
 * Размер компонента
 */
export interface ComponentSize {
  width: number;
  height: number;
}

/**
 * Информация о зарегистрированном компоненте
 */
export interface ComponentRef {
  /** Уникальный идентификатор */
  id: string;
  /** Видимость */
  visible: boolean;
  /** Позиция */
  position: ComponentPosition;
  /** Размер (если известен) */
  size?: ComponentSize;
  /** Дополнительные данные */
  data?: Record<string, unknown>;
  /** Ref на DOM элемент */
  element?: HTMLElement | null;
}

/**
 * ComponentRegistryStore — реестр управляемых компонентов.
 *
 * Позволяет регистрировать компоненты и управлять их состоянием
 * (позиция, видимость, размер) из любого места приложения.
 *
 * @example
 * ```tsx
 * const { componentRegistry } = useRootStore();
 *
 * // В компоненте - регистрация
 * useEffect(() => {
 *   componentRegistry.register('sidebar', { element: ref.current });
 *   return () => componentRegistry.unregister('sidebar');
 * }, []);
 *
 * // В другом месте - управление
 * componentRegistry.setPosition('sidebar', { x: 0, y: 100 });
 * componentRegistry.setVisible('sidebar', false);
 * ```
 */
export class ComponentRegistryStore {
  readonly rootStore: RootStore;

  /**
   * Зарегистрированные компоненты
   */
  components: Map<string, ComponentRef> = new Map();

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  /**
   * Зарегистрировать компонент
   */
  register(
    id: string,
    options?: Partial<Omit<ComponentRef, 'id'>>
  ): void {
    if (this.components.has(id)) {
      // Обновить существующий
      const existing = this.components.get(id)!;
      this.components.set(id, { ...existing, ...options });
    } else {
      // Создать новый
      this.components.set(id, {
        id,
        visible: true,
        position: { x: 0, y: 0 },
        ...options,
      });
    }
  }

  /**
   * Удалить компонент из реестра
   */
  unregister(id: string): void {
    this.components.delete(id);
  }

  /**
   * Получить компонент по id
   */
  getComponent(id: string): ComponentRef | undefined {
    return this.components.get(id);
  }

  /**
   * Проверить, зарегистрирован ли компонент
   */
  has(id: string): boolean {
    return this.components.has(id);
  }

  /**
   * Установить позицию компонента
   */
  setPosition(id: string, position: Partial<ComponentPosition>): void {
    const component = this.components.get(id);
    if (component) {
      component.position = { ...component.position, ...position };
    }
  }

  /**
   * Установить видимость компонента
   */
  setVisible(id: string, visible: boolean): void {
    const component = this.components.get(id);
    if (component) {
      component.visible = visible;
    }
  }

  /**
   * Переключить видимость
   */
  toggleVisible(id: string): void {
    const component = this.components.get(id);
    if (component) {
      component.visible = !component.visible;
    }
  }

  /**
   * Установить размер компонента
   */
  setSize(id: string, size: Partial<ComponentSize>): void {
    const component = this.components.get(id);
    if (component) {
      component.size = { ...component.size, ...size } as ComponentSize;
    }
  }

  /**
   * Установить DOM элемент
   */
  setElement(id: string, element: HTMLElement | null): void {
    const component = this.components.get(id);
    if (component) {
      component.element = element;
    }
  }

  /**
   * Установить дополнительные данные
   */
  setData(id: string, data: Record<string, unknown>): void {
    const component = this.components.get(id);
    if (component) {
      component.data = { ...component.data, ...data };
    }
  }

  /**
   * Получить все видимые компоненты
   */
  get visibleComponents(): ComponentRef[] {
    return Array.from(this.components.values()).filter((c) => c.visible);
  }

  /**
   * Получить все id
   */
  get ids(): string[] {
    return Array.from(this.components.keys());
  }

  /**
   * Очистить реестр
   */
  clear(): void {
    this.components.clear();
  }
}
