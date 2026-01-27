import type { AnalyticsEvent, AnalyticsProvider, UserIdentity } from '../types';

/**
 * ConsoleAnalyticsProvider — провайдер для отладки,
 * выводит все события в консоль.
 *
 * @example
 * ```ts
 * const provider = new ConsoleAnalyticsProvider({ prefix: '[Analytics]' });
 * provider.track({ name: 'click', data: { button: 'submit' }, timestamp: Date.now() });
 * // [Analytics] Event: click { button: 'submit' }
 * ```
 */
export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  readonly name = 'console';

  private prefix: string;
  private globalProperties: Record<string, unknown> = {};

  constructor(options?: { prefix?: string }) {
    this.prefix = options?.prefix ?? '[Analytics]';
  }

  init(): void {
    console.log(`${this.prefix} Initialized`);
  }

  track(event: AnalyticsEvent): void {
    const data = {
      ...this.globalProperties,
      ...event.data,
    };

    console.log(
      `${this.prefix} Event: ${event.name}`,
      Object.keys(data).length > 0 ? data : '',
      `@ ${new Date(event.timestamp).toISOString()}`
    );
  }

  identify(identity: UserIdentity): void {
    console.log(
      `${this.prefix} Identify: ${identity.userId}`,
      identity.traits ?? ''
    );
  }

  reset(): void {
    console.log(`${this.prefix} Reset`);
    this.globalProperties = {};
  }

  setGlobalProperties(properties: Record<string, unknown>): void {
    this.globalProperties = { ...this.globalProperties, ...properties };
    console.log(`${this.prefix} Global properties set:`, this.globalProperties);
  }
}
