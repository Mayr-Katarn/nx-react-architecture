import { configure } from 'mobx';

/**
 * Настройка MobX для проекта.
 * Вызывать один раз при инициализации приложения.
 */
export function setupMobX() {
  configure({
    // Все изменения состояния должны происходить внутри actions
    enforceActions: 'always',
    // Computed значения не требуют обязательной реакции
    computedRequiresReaction: false,
    // Реакции должны зависеть от observable
    reactionRequiresObservable: true,
    // Отключаем внутренние error boundaries для лучшей отладки
    disableErrorBoundaries: false,
  });
}
