import { useAnalytics } from '@nx-react-architecture/analytics';
import { observer, useRootStore } from '@nx-react-architecture/core';
import { useTranslation } from '@nx-react-architecture/i18n';
import {
  AlertLayer,
  Counter,
  ModalLayer,
  Preloader,
  TechScreen,
} from '@nx-react-architecture/ui';
import styles from './app.module.css';
import { DemoPanel } from './components/DemoPanel';

/**
 * Главный компонент приложения.
 *
 * Демонстрирует использование:
 * - Системы слоёв (Preloader → Content → Alerts → Modals → TechScreen)
 * - i18n локализации
 * - MobX observer для реактивности
 * - Все новые системы архитектуры
 */
export const App = observer(() => {
  const { appStore, preloaderStore, techScreenStore } = useRootStore();
  const { t, locale, setLocale } = useTranslation();
  const analytics = useAnalytics();

  const appClassName = `${styles.app} ${appStore.theme === 'dark' ? styles.dark : ''}`;

  // Показ прелоадера пока грузятся ресурсы
  if (preloaderStore.isLoading) {
    return (
      <Preloader
        progress={preloaderStore.progress}
        message={t('common.loading')}
        logo="Nx + React"
      />
    );
  }

  const handleThemeToggle = () => {
    appStore.toggleTheme();
    analytics.track('theme_toggle', { theme: appStore.theme });
  };

  const handleLocaleChange = (newLocale: 'en' | 'ru') => {
    setLocale(newLocale);
    analytics.track('locale_change', { locale: newLocale });
  };

  return (
    <div className={appClassName}>
      {/* Слой 1: Основной контент */}
      <header className={styles.header}>
        <h1>{t('welcome.title')}</h1>
        <p>{t('welcome.subtitle')}</p>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.themeButton}
            onClick={handleThemeToggle}
          >
            {t('theme.toggle')}: {t(`theme.${appStore.theme}`)}
          </button>

          <div className={styles.localeButtons}>
            <button
              type="button"
              className={`${styles.localeButton} ${locale === 'en' ? styles.active : ''}`}
              onClick={() => handleLocaleChange('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`${styles.localeButton} ${locale === 'ru' ? styles.active : ''}`}
              onClick={() => handleLocaleChange('ru')}
            >
              RU
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainContent}>
          <Counter />
          <DemoPanel dark={appStore.theme === 'dark'} />
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          Powered by <strong>MobX</strong> + <strong>MVVM Architecture</strong>
        </p>
      </footer>

      {/* Слой 2: Алерты (z-index: 100) */}
      <AlertLayer />

      {/* Слой 3: Модалки (z-index: 200) */}
      <ModalLayer />

      {/* Слой 4: Техэкран (z-index: 9999) */}
      {techScreenStore.isActive && techScreenStore.config && (
        <TechScreen
          type={techScreenStore.config.type}
          title={techScreenStore.config.title}
          message={techScreenStore.config.message}
          showRetry={techScreenStore.config.showRetry}
          onRetry={techScreenStore.retry}
        />
      )}
    </div>
  );
});

export default App;
