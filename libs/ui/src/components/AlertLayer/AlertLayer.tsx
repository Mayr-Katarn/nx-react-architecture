import { observer } from 'mobx-react-lite';
import { useAlertStore } from '@nx-react-architecture/core';
import { Alert } from '../Alert';
import styles from './AlertLayer.module.css';

/**
 * AlertLayer — слой рендеринга алертов.
 *
 * Автоматически отображает все активные алерты из AlertStore.
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
export const AlertLayer = observer(() => {
  const alertStore = useAlertStore();

  if (!alertStore.hasAlerts) return null;

  return (
    <div className={styles.container}>
      {alertStore.alerts.map((alert) => (
        <Alert
          key={alert.id}
          id={alert.id}
          message={alert.message}
          type={alert.type}
          dismissible={alert.dismissible}
          onDismiss={(id) => alertStore.dismiss(id)}
        />
      ))}
    </div>
  );
});

export default AlertLayer;
