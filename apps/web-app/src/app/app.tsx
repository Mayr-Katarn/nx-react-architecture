import { observer, useAppStore } from '@nx-react-architecture/core';
import { Counter } from '@nx-react-architecture/ui';
import styles from './app.module.css';

/**
 * Главный компонент приложения.
 * Демонстрирует использование:
 * - MobX observer для реактивности
 * - useAppStore для доступа к глобальному состоянию
 * - Counter компонент с MVVM паттерном
 */
export const App = observer(() => {
  const appStore = useAppStore();
  const appClassName = `${styles.app} ${appStore.theme === 'dark' ? styles.dark : ''}`;

  return (
    <div className={appClassName}>
      <header className={styles.header}>
        <h1>Nx + React + MobX</h1>
        <p>MVVM Architecture Example</p>

        <button
          type="button"
          className={styles.themeButton}
          onClick={() => appStore.toggleTheme()}
        >
          Theme: {appStore.theme}
        </button>
      </header>

      <main className={styles.main}>
        <Counter />
      </main>

      <footer className={styles.footer}>
        <p>
          Powered by <strong>MobX</strong> + <strong>mobx-view-model</strong>
        </p>
      </footer>
    </div>
  );
});

export default App;
