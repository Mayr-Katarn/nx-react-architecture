import { observer } from 'mobx-react-lite';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { useComponentRegistry } from '@nx-react-architecture/core';

export interface ManagedComponentProps {
  /** Уникальный идентификатор компонента */
  id: string;
  /** Дочерние элементы */
  children: ReactNode;
  /** CSS класс */
  className?: string;
  /** Inline стили */
  style?: CSSProperties;
  /** Применять позицию из store */
  applyPosition?: boolean;
  /** Начальная позиция */
  initialPosition?: { x: number; y: number };
  /** Дополнительные данные для регистрации */
  data?: Record<string, unknown>;
}

/**
 * ManagedComponent — HOC для регистрации компонента в ComponentRegistry.
 *
 * Позволяет управлять компонентом (позиция, видимость) из любого места приложения.
 *
 * @example
 * ```tsx
 * // Регистрация компонента
 * <ManagedComponent id="sidebar" applyPosition>
 *   <Sidebar />
 * </ManagedComponent>
 *
 * // Управление из другого места
 * const { componentRegistry } = useRootStore();
 * componentRegistry.setPosition('sidebar', { x: 0, y: 100 });
 * componentRegistry.setVisible('sidebar', false);
 * ```
 */
export const ManagedComponent = observer<ManagedComponentProps>(
  ({
    id,
    children,
    className,
    style,
    applyPosition = false,
    initialPosition,
    data,
  }) => {
    const registry = useComponentRegistry();
    const ref = useRef<HTMLDivElement>(null);

    // Регистрация при монтировании
    useEffect(() => {
      registry.register(id, {
        position: initialPosition ?? { x: 0, y: 0 },
        data,
        element: ref.current,
      });

      return () => {
        registry.unregister(id);
      };
    }, [id, registry, initialPosition, data]);

    // Обновление ref элемента
    useEffect(() => {
      if (ref.current) {
        registry.setElement(id, ref.current);
      }
    }, [id, registry]);

    const component = registry.getComponent(id);

    // Если компонент скрыт — не рендерим
    if (component && !component.visible) {
      return null;
    }

    // Вычисление стилей
    const computedStyle: CSSProperties = {
      ...style,
    };

    if (applyPosition && component) {
      computedStyle.transform = `translate(${component.position.x}px, ${component.position.y}px)`;
    }

    return (
      <div ref={ref} className={className} style={computedStyle}>
        {children}
      </div>
    );
  }
);

export default ManagedComponent;
