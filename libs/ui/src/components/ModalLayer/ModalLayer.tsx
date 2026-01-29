import { getCurrentModal, useModalStore } from '@nx-react-architecture/core';

/**
 * ModalLayer — слой рендеринга модальных окон.
 *
 * Автоматически отображает текущую активную модалку из ModalStore (Zustand).
 * Должен быть размещён в корне приложения.
 *
 * @example
 * ```tsx
 * // В App.tsx
 * <div className={styles.app}>
 *   <Content />
 *   <AlertLayer />
 *   <ModalLayer />
 * </div>
 * ```
 */
export const ModalLayer = () => {
  // Вычисляем currentModal через селектор
  const currentModal = useModalStore((state) => getCurrentModal(state.modals));
  const close = useModalStore((state) => state.close);

  if (!currentModal) return null;

  const { component: Component, props, id } = currentModal;

  const handleClose = () => {
    close(id);
  };

  // Рендерим компонент с его props + добавляем onClose
  return <Component {...props} onClose={handleClose} />;
};

export default ModalLayer;
