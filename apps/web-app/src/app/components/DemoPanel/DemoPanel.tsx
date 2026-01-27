import { useAnalytics } from '@nx-react-architecture/analytics';
import { useApi } from '@nx-react-architecture/api';
import {
  ModalPriority,
  observer,
  useRootStore,
} from '@nx-react-architecture/core';
import { useTranslation } from '@nx-react-architecture/i18n';
import { Modal } from '@nx-react-architecture/ui';
import styles from './DemoPanel.module.css';

/**
 * Пример модального окна подтверждения
 */
const ConfirmModal = observer<{ onClose: () => void; message?: string }>(
  ({ onClose, message }) => {
    const { t } = useTranslation();
    const { alertStore } = useRootStore();

    const handleConfirm = () => {
      alertStore.success(t('alerts.saved'));
      onClose();
    };

    return (
      <Modal
        title={t('common.confirm')}
        onClose={onClose}
        size="small"
        footer={
          <>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonOutline}`}
              onClick={onClose}
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={handleConfirm}
            >
              {t('common.confirm')}
            </button>
          </>
        }
      >
        <p>{message || 'Are you sure you want to proceed?'}</p>
      </Modal>
    );
  },
);

/**
 * DemoPanel — панель с примерами использования всех систем.
 */
export const DemoPanel = observer<{ dark?: boolean }>(({ dark }) => {
  const { alertStore, modalStore, techScreenStore, preloaderStore } =
    useRootStore();
  const { t } = useTranslation();
  const analytics = useAnalytics();
  const api = useApi();

  // === ALERTS ===
  const showSuccessAlert = () => {
    alertStore.success(t('alerts.saved'));
    analytics.track('demo_alert', { type: 'success' });
  };

  const showErrorAlert = () => {
    alertStore.error(t('alerts.error'));
    analytics.track('demo_alert', { type: 'error' });
  };

  const showWarningAlert = () => {
    alertStore.warning('This is a warning message');
    analytics.track('demo_alert', { type: 'warning' });
  };

  const showInfoAlert = () => {
    alertStore.info('This is an info message');
    analytics.track('demo_alert', { type: 'info' });
  };

  // === MODALS ===
  const openModal = () => {
    modalStore.open({
      id: 'demo-confirm',
      component: ConfirmModal,
      props: { message: 'This is a demo modal with priority system.' },
      priority: ModalPriority.NORMAL,
    });
    analytics.track('demo_modal', { action: 'open' });
  };

  const openHighPriorityModal = () => {
    modalStore.open({
      id: 'demo-high-priority',
      component: ConfirmModal,
      props: { message: 'This modal has HIGH priority!' },
      priority: ModalPriority.HIGH,
    });
    analytics.track('demo_modal', { action: 'open', priority: 'high' });
  };

  // === TECH SCREENS ===
  const showMaintenance = () => {
    techScreenStore.showMaintenance(t('techScreen.maintenance.message'));
    analytics.track('demo_tech_screen', { type: 'maintenance' });
    // Автоскрытие через 3 секунды для демо
    setTimeout(() => {
      techScreenStore.hide();
    }, 3000);
  };

  const showUpdate = () => {
    techScreenStore.showUpdate(t('techScreen.update.message'));
    analytics.track('demo_tech_screen', { type: 'update' });
    setTimeout(() => {
      techScreenStore.hide();
    }, 3000);
  };

  const showError = () => {
    techScreenStore.showError(t('techScreen.error.message'), () => {
      techScreenStore.hide();
    });
    analytics.track('demo_tech_screen', { type: 'error' });
  };

  // === PRELOADER ===
  const simulateLoading = async () => {
    analytics.track('demo_preloader', { action: 'start' });

    // Симуляция загрузки текстур
    const fakeUrls = [
      '/textures/demo1.png',
      '/textures/demo2.png',
      '/textures/demo3.png',
    ];

    // Регистрируем ассеты
    fakeUrls.forEach((url) => {
      preloaderStore.registerAsset(url);
    });

    // Включаем загрузку
    preloaderStore['isLoading'] = true;

    // Симулируем загрузку каждого ассета
    for (const url of fakeUrls) {
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
      preloaderStore.markAssetLoaded(url);
    }

    // Завершаем загрузку
    setTimeout(() => {
      preloaderStore.reset();
    }, 500);
  };

  // === API ===
  const testApiCall = async () => {
    analytics.track('demo_api', { action: 'test_call' });
    try {
      // Это демо-вызов, который завершится ошибкой (нет реального API)
      await api.get('/demo/test');
      alertStore.success('API call successful!');
    } catch {
      alertStore.info('API demo: endpoint not available (expected)');
    }
  };

  return (
    <div className={`${styles.panel} ${dark ? styles.dark : ''}`}>
      <h3 className={styles.title}>Demo Panel</h3>

      {/* Alerts Demo */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Alerts</h4>
        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSuccess}`}
            onClick={showSuccessAlert}
          >
            Success
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonDanger}`}
            onClick={showErrorAlert}
          >
            Error
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonWarning}`}
            onClick={showWarningAlert}
          >
            Warning
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonInfo}`}
            onClick={showInfoAlert}
          >
            Info
          </button>
        </div>
      </div>

      {/* Modals Demo */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Modals</h4>
        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={openModal}
          >
            Open Modal
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonWarning}`}
            onClick={openHighPriorityModal}
          >
            High Priority
          </button>
        </div>
      </div>

      {/* Tech Screens Demo */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Tech Screens (3s auto-hide)</h4>
        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonOutline}`}
            onClick={showMaintenance}
          >
            Maintenance
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonOutline}`}
            onClick={showUpdate}
          >
            Update
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonOutline}`}
            onClick={showError}
          >
            Error
          </button>
        </div>
      </div>

      {/* Preloader Demo */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Preloader</h4>
        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={simulateLoading}
          >
            Simulate Loading
          </button>
        </div>
      </div>

      {/* API Demo */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>API</h4>
        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonInfo}`}
            onClick={testApiCall}
          >
            Test API Call
          </button>
        </div>
      </div>
    </div>
  );
});
