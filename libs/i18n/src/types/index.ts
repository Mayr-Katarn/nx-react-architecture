/**
 * Поддерживаемые локали
 */
export type Locale = 'en' | 'ru';

/**
 * Структура переводов - вложенный объект со строками
 */
export type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};

/**
 * Параметры для интерполяции в переводах
 */
export type TranslationParams = Record<string, string | number>;

/**
 * Конфигурация i18n
 */
export interface I18nConfig {
  defaultLocale: Locale;
  fallbackLocale: Locale;
  locales: Locale[];
}
