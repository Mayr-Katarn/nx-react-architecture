import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';
import { AlertStore } from './alert.store';
import { AppStore } from './app.store';
import { ComponentRegistryStore } from './component-registry.store';
import { PreloaderStore } from './preloader.store';
import { TechScreenStore } from './tech-screen.store';

/**
 * RootStore - глобальное хранилище приложения.
 *
 * Содержит глобальное состояние, которое должно быть доступно
 * во всём приложении (например, данные пользователя, тема, настройки).
 *
 * @example
 * ```tsx
 * // В приложении
 * const rootStore = new RootStore();
 * await rootStore.init();
 *
 * // В компоненте
 * const { appStore, modalStore, alertStore } = useRootStore();
 * ```
 */
export class RootStore {
  /**
   * Хранилище состояния приложения
   */
  appStore: AppStore;

  /**
   * Хранилище прелоадера
   */
  preloaderStore: PreloaderStore;

  /**
   * Хранилище технических экранов
   */
  techScreenStore: TechScreenStore;

  /**
   * Хранилище алертов
   */
  alertStore: AlertStore;

  /**
   * Реестр компонентов
   */
  componentRegistry: ComponentRegistryStore;

  constructor() {
    this.appStore = new AppStore(this);
    this.preloaderStore = new PreloaderStore(this);
    this.techScreenStore = new TechScreenStore(this);
    this.alertStore = new AlertStore(this);
    this.componentRegistry = new ComponentRegistryStore(this);

    makeAutoObservable(this);
  }

  /**
   * Инициализация всех stores
   */
  async init(): Promise<void> {
    await this.appStore.init();
  }
}

// React Context для RootStore
const RootStoreContext = createContext<RootStore | null>(null);

/**
 * Provider для RootStore
 */
export const RootStoreProvider = RootStoreContext.Provider;

/**
 * Hook для доступа к RootStore
 *
 * @throws Error если используется вне RootStoreProvider
 */
export function useRootStore(): RootStore {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }
  return store;
}

/**
 * Hook для доступа к AppStore
 */
export function useAppStore(): AppStore {
  return useRootStore().appStore;
}

/**
 * Hook для доступа к PreloaderStore
 */
export function usePreloaderStore(): PreloaderStore {
  return useRootStore().preloaderStore;
}

/**
 * Hook для доступа к TechScreenStore
 */
export function useTechScreenStore(): TechScreenStore {
  return useRootStore().techScreenStore;
}

/**
 * Hook для доступа к AlertStore
 */
export function useAlertStore(): AlertStore {
  return useRootStore().alertStore;
}

/**
 * Hook для доступа к ComponentRegistryStore
 */
export function useComponentRegistry(): ComponentRegistryStore {
  return useRootStore().componentRegistry;
}
