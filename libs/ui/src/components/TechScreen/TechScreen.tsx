import { observer } from 'mobx-react-lite';
import type { TechScreenType } from '@nx-react-architecture/core';
import styles from './TechScreen.module.css';

export interface TechScreenProps {
  /** Тип экрана */
  type: TechScreenType;
  /** Заголовок */
  title?: string;
  /** Сообщение */
  message?: string;
  /** Показывать кнопку retry */
  showRetry?: boolean;
  /** Callback при нажатии retry */
  onRetry?: () => void;
}

const defaultTitles: Record<TechScreenType, string> = {
  maintenance: 'Maintenance',
  update: 'Update Required',
  error: 'Something went wrong',
  custom: 'Notice',
};

const defaultMessages: Record<TechScreenType, string> = {
  maintenance: 'We are currently performing scheduled maintenance. Please try again later.',
  update: 'Please refresh the page to get the latest version.',
  error: 'An unexpected error occurred. Please try again.',
  custom: '',
};

const icons: Record<TechScreenType, string> = {
  maintenance: '🔧',
  update: '🔄',
  error: '⚠️',
  custom: 'ℹ️',
};

/**
 * TechScreen — технический экран (верхний слой).
 *
 * Используется для показа информации о техработах,
 * необходимости обновления или критических ошибках.
 *
 * @example
 * ```tsx
 * <TechScreen
 *   type="maintenance"
 *   message="Back at 6:00 PM"
 * />
 * ```
 */
export const TechScreen = observer<TechScreenProps>(
  ({ type, title, message, showRetry, onRetry }) => {
    const displayTitle = title ?? defaultTitles[type];
    const displayMessage = message ?? defaultMessages[type];

    return (
      <div className={`${styles.container} ${styles[type]}`}>
        <div className={styles.content}>
          <div className={styles.icon}>{icons[type]}</div>
          <h1 className={styles.title}>{displayTitle}</h1>
          {displayMessage && (
            <p className={styles.message}>{displayMessage}</p>
          )}
          {showRetry && onRetry && (
            <button
              type="button"
              className={styles.retryButton}
              onClick={onRetry}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }
);

export default TechScreen;
