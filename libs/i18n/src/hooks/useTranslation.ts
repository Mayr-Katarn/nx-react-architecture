import { useCallback } from 'react';
import { useI18n } from '../stores';
import type { TranslationParams } from '../types';

/**
 * Хук для доступа к функции перевода.
 *
 * @example
 * ```tsx
 * const { t, locale, setLocale } = useTranslation();
 *
 * return (
 *   <div>
 *     <h1>{t('welcome.title')}</h1>
 *     <p>{t('counter.value', { value: 42 })}</p>
 *     <button onClick={() => setLocale('ru')}>RU</button>
 *   </div>
 * );
 * ```
 */
export function useTranslation() {
  const i18n = useI18n();

  const t = useCallback(
    (key: string, params?: TranslationParams) => i18n.t(key, params),
    [i18n]
  );

  const setLocale = useCallback(
    (locale: 'en' | 'ru') => i18n.setLocale(locale),
    [i18n]
  );

  return {
    t,
    locale: i18n.currentLocale,
    setLocale,
    isLoading: i18n.isLoading,
    availableLocales: i18n.availableLocales,
    getLocaleName: i18n.getLocaleName,
  };
}
