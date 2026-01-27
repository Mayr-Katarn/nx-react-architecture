import { observer } from 'mobx-react-lite';
import type { AlertType } from '@nx-react-architecture/core';
import styles from './Alert.module.css';

export interface AlertProps {
  /** ID алерта */
  id: string;
  /** Сообщение */
  message: string;
  /** Тип алерта */
  type: AlertType;
  /** Можно ли закрыть */
  dismissible?: boolean;
  /** Callback закрытия */
  onDismiss?: (id: string) => void;
}

const icons: Record<AlertType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

/**
 * Alert — компонент уведомления.
 *
 * @example
 * ```tsx
 * <Alert
 *   id="alert-1"
 *   message="Changes saved!"
 *   type="success"
 *   onDismiss={(id) => alertStore.dismiss(id)}
 * />
 * ```
 */
export const Alert = observer<AlertProps>(
  ({ id, message, type, dismissible = true, onDismiss }) => {
    return (
      <div className={`${styles.alert} ${styles[type]}`} role="alert">
        <span className={styles.icon}>{icons[type]}</span>
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>
        {dismissible && onDismiss && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => onDismiss(id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    );
  }
);

export default Alert;
