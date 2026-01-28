import { observer } from 'mobx-react-lite';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import styles from './Modal.module.css';

export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

export interface ModalProps {
  /** Заголовок модалки */
  title?: string;
  /** Контент */
  children: ReactNode;
  /** Footer (кнопки действий) */
  footer?: ReactNode;
  /** Размер */
  size?: ModalSize;
  /** Callback закрытия */
  onClose: () => void;
  /** Закрывать по клику на overlay */
  closeOnOverlay?: boolean;
  /** Закрывать по Escape */
  closeOnEscape?: boolean;
  /** Показывать кнопку закрытия */
  showCloseButton?: boolean;
  /** Тёмная тема */
  dark?: boolean;
}

/**
 * Modal — базовый компонент модального окна.
 *
 * @example
 * ```tsx
 * <Modal
 *   title="Confirm"
 *   onClose={() => modalStore.close('confirm')}
 *   footer={
 *     <>
 *       <Button onClick={handleCancel}>Cancel</Button>
 *       <Button onClick={handleConfirm}>OK</Button>
 *     </>
 *   }
 * >
 *   <p>Are you sure?</p>
 * </Modal>
 * ```
 */
export const Modal = observer<ModalProps>(
  ({
    title,
    children,
    footer,
    size = 'medium',
    onClose,
    closeOnOverlay = true,
    closeOnEscape = true,
    showCloseButton = true,
    dark = false,
  }) => {
    // Обработка Escape
    useEffect(() => {
      if (!closeOnEscape) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeOnEscape, onClose]);

    // Блокировка скролла body
    // useEffect(() => {
    //   const originalOverflow = document.body.style.overflow;
    //   document.body.style.overflow = 'hidden';
    //   return () => {
    //     document.body.style.overflow = originalOverflow;
    //   };
    // }, []);

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlay && e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div
        className={`${styles.overlay} ${dark ? styles.dark : ''}`}
        onClick={handleOverlayClick}
      >
        <div className={`${styles.modal} ${styles[size]}`}>
          {(title || showCloseButton) && (
            <div className={styles.header}>
              {title && <h2 className={styles.title}>{title}</h2>}
              {showCloseButton && (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close"
                >
                  ×
                </button>
              )}
            </div>
          )}

          <div className={styles.body}>{children}</div>

          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    );
  },
);

export default Modal;
