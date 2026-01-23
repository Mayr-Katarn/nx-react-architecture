import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';

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
 *
 * // В компоненте
 * const { appStore } = useRootStore();
 * console.log(appStore.isInitialized);
 * ```
 */
export class RootStore {
  /**
   * Хранилище состояния приложения
   */
  appStore: AppStore;

  constructor() {
    this.appStore = new AppStore(this);
    makeAutoObservable(this);
  }

  /**
   * Инициализация всех stores
   */
  async init(): Promise<void> {
    await this.appStore.init();
  }
}

/**
 * AppStore - хранилище общего состояния приложения.
 */
export class AppStore {
  /**
   * Ссылка на RootStore для доступа к другим stores
   */
  readonly rootStore: RootStore;

  /**
   * Флаг инициализации приложения
   */
  isInitialized = false;

  /**
   * Текущая тема
   */
  theme: 'light' | 'dark' = 'light';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  /**
   * Инициализация store
   */
  async init(): Promise<void> {
    // Здесь можно загрузить начальные данные
    // например, из localStorage или API
    this.loadThemeFromStorage();
    this.isInitialized = true;
  }

  /**
   * Переключить тему
   */
  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.saveThemeToStorage();
  }

  /**
   * Установить тему
   */
  setTheme(theme: 'light' | 'dark'): void {
    this.theme = theme;
    this.saveThemeToStorage();
  }

  private loadThemeFromStorage(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') {
        this.theme = saved;
      }
    }
  }

  private saveThemeToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', this.theme);
    }
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
