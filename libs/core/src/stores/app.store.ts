import { makeAutoObservable } from 'mobx';
import type { RootStore } from './root.store';

/**
 * AppStore — хранилище общего состояния приложения.
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
