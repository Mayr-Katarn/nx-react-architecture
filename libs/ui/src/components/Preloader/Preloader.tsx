import { observer } from 'mobx-react-lite';
import styles from './Preloader.module.css';

export interface PreloaderProps {
  /** Прогресс загрузки (0-100) */
  progress?: number;
  /** Текст сообщения */
  message?: string;
  /** Показывать прогресс-бар или спиннер */
  variant?: 'progress' | 'spinner';
  /** Текст логотипа/заголовка */
  logo?: string;
}

/**
 * Preloader — экран загрузки приложения.
 *
 * @example
 * ```tsx
 * // С прогресс-баром
 * <Preloader progress={75} message="Loading assets..." />
 *
 * // Со спиннером
 * <Preloader variant="spinner" message="Please wait..." />
 * ```
 */
export const Preloader = observer<PreloaderProps>(
  ({
    progress = 0,
    message = 'Loading...',
    variant = 'progress',
    logo = 'App',
  }) => {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>{logo}</div>

          {variant === 'spinner' ? (
            <div className={styles.spinner} />
          ) : (
            <>
              <div className={styles.progressContainer}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
              <div className={styles.percentage}>{Math.round(progress)}%</div>
            </>
          )}

          <div className={styles.message}>{message}</div>
        </div>
      </div>
    );
  }
);

export default Preloader;
