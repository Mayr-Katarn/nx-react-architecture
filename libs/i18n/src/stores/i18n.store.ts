import { makeAutoObservable, runInAction } from 'mobx';
import { createContext, useContext } from 'react';
// Импорт локалей (бандлятся статически)
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import type {
  I18nConfig,
  Locale,
  TranslationDictionary,
  TranslationParams,
} from '../types';

const bundledLocales: Record<Locale, TranslationDictionary> = {
  en,
  ru,
};

/**
 * I18nStore — MobX store для управления локализацией.
 *
 * @example
 * ```tsx
 * const i18nStore = new I18nStore({ defaultLocale: 'ru' });
 * console.log(i18nStore.t('welcome.title')); // "Добро пожаловать"
 * i18nStore.setLocale('en');
 * console.log(i18nStore.t('welcome.title')); // "Welcome"
 * ```
 */
export class I18nStore {
  /**
   * Текущая локаль
   */
  currentLocale: Locale;

  /**
   * Загруженные переводы для текущей локали
   */
  translations: TranslationDictionary = {};

  /**
   * Флаг загрузки локали
   */
  isLoading = false;

  /**
   * Конфигурация
   */
  readonly config: I18nConfig;

  constructor(config?: Partial<I18nConfig>) {
    this.config = {
      defaultLocale: config?.defaultLocale ?? 'en',
      fallbackLocale: config?.fallbackLocale ?? 'en',
      locales: config?.locales ?? ['en', 'ru'],
    };
    this.currentLocale = this.config.defaultLocale;
    this.translations = bundledLocales[this.currentLocale] ?? {};

    makeAutoObservable(this, undefined, { autoBind: true });
  }

  /**
   * Инициализация — загрузка сохранённой локали из localStorage
   */
  async init(): Promise<void> {
    const savedLocale = this.getSavedLocale();
    if (savedLocale && savedLocale !== this.currentLocale) {
      await this.setLocale(savedLocale);
    }
  }

  /**
   * Установить локаль
   */
  async setLocale(locale: Locale): Promise<void> {
    if (!this.config.locales.includes(locale)) {
      console.warn(`Locale "${locale}" is not supported`);
      return;
    }

    this.isLoading = true;

    try {
      // Для бандленных локалей — синхронная загрузка
      const translations = bundledLocales[locale];

      runInAction(() => {
        this.currentLocale = locale;
        this.translations = translations ?? {};
        this.isLoading = false;
      });

      this.saveLocale(locale);
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
      });
      console.error(`Failed to load locale "${locale}"`, error);
    }
  }

  /**
   * Получить перевод по ключу
   *
   * @param key - ключ перевода (например, "welcome.title")
   * @param params - параметры для интерполяции (например, { value: 42 })
   * @returns переведённая строка или ключ, если перевод не найден
   */
  t(key: string, params?: TranslationParams): string {
    const value = this.getNestedValue(this.translations, key);

    if (typeof value !== 'string') {
      // Попробовать fallback локаль
      if (this.currentLocale !== this.config.fallbackLocale) {
        const fallbackTranslations = bundledLocales[this.config.fallbackLocale];
        const fallbackValue = this.getNestedValue(fallbackTranslations, key);
        if (typeof fallbackValue === 'string') {
          return this.interpolate(fallbackValue, params);
        }
      }
      return key;
    }

    return this.interpolate(value, params);
  }

  /**
   * Проверить, существует ли перевод
   */
  has(key: string): boolean {
    const value = this.getNestedValue(this.translations, key);
    return typeof value === 'string';
  }

  /**
   * Получить список доступных локалей
   */
  get availableLocales(): Locale[] {
    return this.config.locales;
  }

  /**
   * Получить название локали
   */
  getLocaleName(locale: Locale): string {
    const names: Record<Locale, string> = {
      en: 'English',
      ru: 'Русский',
    };
    return names[locale] ?? locale;
  }

  private getNestedValue(
    obj: TranslationDictionary,
    path: string,
  ): string | TranslationDictionary | undefined {
    const keys = path.split('.');
    let current: string | TranslationDictionary | undefined = obj;

    for (const key of keys) {
      if (current === undefined || typeof current === 'string') {
        return undefined;
      }
      current = current[key];
    }

    return current;
  }

  private interpolate(text: string, params?: TranslationParams): string {
    if (!params) return text;

    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const value = params[key];
      return value !== undefined ? String(value) : `{{${key}}}`;
    });
  }

  private getSavedLocale(): Locale | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('locale');
    if (saved && this.config.locales.includes(saved as Locale)) {
      return saved as Locale;
    }
    return null;
  }

  private saveLocale(locale: Locale): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('locale', locale);
  }
}

// React Context
const I18nContext = createContext<I18nStore | null>(null);

/**
 * Provider для I18nStore
 */
export const I18nProvider = I18nContext.Provider;

/**
 * Hook для доступа к I18nStore
 */
export function useI18n(): I18nStore {
  const store = useContext(I18nContext);
  if (!store) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return store;
}
