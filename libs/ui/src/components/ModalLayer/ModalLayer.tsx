import { observer } from 'mobx-react-lite';
import { useModalStore } from '@nx-react-architecture/core';
import { Modal } from '../Modal';

/**
 * ModalLayer — слой рендеринга модальных окон.
 *
 * Автоматически отображает текущую активную модалку из ModalStore.
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
export const ModalLayer = observer(() => {
  const modalStore = useModalStore();
  const current = modalStore.currentModal;

  if (!current) return null;

  const { component: Component, props, id } = current;

  const handleClose = () => {
    modalStore.close(id);
  };

  // Если компонент — это полноценная модалка, рендерим как есть
  // Если нет — оборачиваем в Modal
  return <Component {...props} onClose={handleClose} />;
});

export default ModalLayer;
