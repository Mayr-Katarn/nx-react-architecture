import { makeAutoObservable } from 'mobx';

/**
 * Тип для любого объекта
 */
type AnyObject = Record<string, unknown>;

/**
 * Базовый класс ViewModel для приложения.
 * Использует makeAutoObservable для автоматического создания observables.
 *
 * @template TPayload - тип payload, передаваемый в ViewModel
 *
 * @example
 * ```tsx
 * class MyViewModel extends AppViewModelBase<{ userId: string }> {
 *   data = null;
 *
 *   constructor(payload?: { userId: string }) {
 *     super(payload);
 *   }
 *
 *   async loadData() {
 *     this.setLoading(true);
 *     try {
 *       this.data = await api.getData(this.payload?.userId);
 *     } catch (e) {
 *       this.setError(e);
 *     } finally {
 *       this.setLoading(false);
 *     }
 *   }
 * }
 * ```
 */
export abstract class AppViewModelBase<
  TPayload extends AnyObject = AnyObject,
> {
  /**
   * Payload переданный в ViewModel
   */
  readonly payload?: TPayload;

  /**
   * Флаг загрузки данных
   */
  loading = false;

  /**
   * Ошибка, если произошла
   */
  error: Error | null = null;

  constructor(payload?: TPayload) {
    this.payload = payload;
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  /**
   * Проверка, загружается ли что-то
   */
  get isLoading(): boolean {
    return this.loading;
  }

  /**
   * Проверка наличия ошибки
   */
  get hasError(): boolean {
    return this.error !== null;
  }

  /**
   * Текст ошибки
   */
  get errorMessage(): string | null {
    return this.error?.message ?? null;
  }

  /**
   * Установить состояние загрузки
   */
  setLoading(value: boolean): void {
    this.loading = value;
  }

  /**
   * Установить ошибку
   */
  setError(error: Error | unknown | null): void {
    if (error instanceof Error) {
      this.error = error;
    } else if (error) {
      this.error = new Error(String(error));
    } else {
      this.error = null;
    }
  }

  /**
   * Очистить ошибку
   */
  clearError(): void {
    this.error = null;
  }

  /**
   * Сбросить состояние загрузки и ошибки
   */
  resetState(): void {
    this.loading = false;
    this.error = null;
  }
}
