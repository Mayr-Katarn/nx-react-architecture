import {
  AnalyticsProvider,
  AnalyticsStore,
  ConsoleAnalyticsProvider,
} from '@nx-react-architecture/analytics';
import { ApiProvider, ApiStore } from '@nx-react-architecture/api';
import {
  RootStore,
  RootStoreProvider,
  setupMobX,
} from '@nx-react-architecture/core';
import { I18nProvider, I18nStore } from '@nx-react-architecture/i18n';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';

// Инициализация MobX
setupMobX();

// Создание глобальных store'ов
const rootStore = new RootStore();

const i18nStore = new I18nStore({
  defaultLocale: 'ru',
  fallbackLocale: 'en',
});

const apiStore = new ApiStore({
  baseUrl: import.meta.env.VITE_API_URL || '/api',
});

const analyticsStore = new AnalyticsStore({
  providers: [new ConsoleAnalyticsProvider({ prefix: '[Analytics]' })],
  config: {
    enabled: true,
    debug: import.meta.env.DEV,
  },
});

// Асинхронная инициализация
async function bootstrap() {
  // Инициализация stores
  await Promise.all([
    rootStore.init(),
    i18nStore.init(),
    analyticsStore.init(),
  ]);

  // Трекинг старта приложения
  analyticsStore.track('app_start', {
    locale: i18nStore.currentLocale,
    theme: rootStore.appStore.theme,
  });

  // Рендер приложения
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <StrictMode>
      <RootStoreProvider value={rootStore}>
        <I18nProvider value={i18nStore}>
          <ApiProvider value={apiStore}>
            <AnalyticsProvider value={analyticsStore}>
              <App />
            </AnalyticsProvider>
          </ApiProvider>
        </I18nProvider>
      </RootStoreProvider>
    </StrictMode>
  );
}

bootstrap();
