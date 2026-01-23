import { makeAutoObservable } from 'mobx';

/**
 * ViewModel для компонента Counter.
 *
 * Демонстрирует паттерн MVVM:
 * - observable состояние (count, step)
 * - action методы изменения состояния (increment, decrement, reset)
 * - computed производные значения (doubled, isPositive)
 */
export class CounterViewModel {
  /**
   * Текущее значение счётчика
   */
  count = 0;

  /**
   * Шаг изменения
   */
  step = 1;

  /**
   * Флаг загрузки
   */
  loading = false;

  /**
   * Ошибка
   */
  error: Error | null = null;

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  /**
   * Удвоенное значение
   */
  get doubled(): number {
    return this.count * 2;
  }

  /**
   * Проверка, положительное ли значение
   */
  get isPositive(): boolean {
    return this.count > 0;
  }

  /**
   * Проверка, отрицательное ли значение
   */
  get isNegative(): boolean {
    return this.count < 0;
  }

  /**
   * Увеличить счётчик на шаг
   */
  increment = (): void => {
    this.count += this.step;
  };

  /**
   * Уменьшить счётчик на шаг
   */
  decrement = (): void => {
    this.count -= this.step;
  };

  /**
   * Сбросить счётчик
   */
  reset = (): void => {
    this.count = 0;
  };

  /**
   * Установить шаг изменения
   */
  setStep = (value: number): void => {
    this.step = Math.max(1, value);
  };
}
