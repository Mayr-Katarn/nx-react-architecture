import {
  RootStore,
  RootStoreProvider,
  setupMobX,
} from '@nx-react-architecture/core';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';

// Инициализация MobX
setupMobX();

// Создание глобального store
const rootStore = new RootStore();
rootStore.init();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <RootStoreProvider value={rootStore}>
      <App />
    </RootStoreProvider>
  </StrictMode>,
);
