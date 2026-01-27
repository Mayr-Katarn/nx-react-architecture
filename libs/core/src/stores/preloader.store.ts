import { makeAutoObservable, runInAction } from 'mobx';
import type { RootStore } from './root.store';

/**
 * Информация о загружаемом ассете
 */
export interface AssetInfo {
  url: string;
  status: 'pending' | 'loading' | 'loaded' | 'error';
  error?: Error;
}

/**
 * PreloaderStore — управление загрузкой ресурсов перед запуском приложения.
 *
 * @example
 * ```tsx
 * const { preloaderStore } = useRootStore();
 *
 * // Зарегистрировать и загрузить текстуры
 * await preloaderStore.loadTextures([
 *   '/textures/hero.png',
 *   '/textures/enemy.png',
 * ]);
 *
 * // Проверить прогресс
 * console.log(preloaderStore.progress); // 0-100
 * ```
 */
export class PreloaderStore {
  readonly rootStore: RootStore;

  /**
   * Зарегистрированные ассеты
   */
  assets: Map<string, AssetInfo> = new Map();

  /**
   * Флаг активной загрузки
   */
  isLoading = false;

  /**
   * Минимальное время показа прелоадера (мс)
   */
  minDisplayTime = 500;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  /**
   * Прогресс загрузки (0-100)
   */
  get progress(): number {
    if (this.assets.size === 0) return 100;

    const loaded = Array.from(this.assets.values()).filter(
      (a) => a.status === 'loaded'
    ).length;

    return Math.round((loaded / this.assets.size) * 100);
  }

  /**
   * Все ассеты загружены
   */
  get isComplete(): boolean {
    return this.progress === 100 && !this.isLoading;
  }

  /**
   * Список загруженных URL
   */
  get loadedAssets(): string[] {
    return Array.from(this.assets.entries())
      .filter(([, info]) => info.status === 'loaded')
      .map(([url]) => url);
  }

  /**
   * Список ошибок загрузки
   */
  get errors(): Array<{ url: string; error: Error }> {
    return Array.from(this.assets.entries())
      .filter(([, info]) => info.status === 'error' && info.error)
      .map(([url, info]) => ({ url, error: info.error! }));
  }

  /**
   * Зарегистрировать ассет для загрузки
   */
  registerAsset(url: string): void {
    if (!this.assets.has(url)) {
      this.assets.set(url, { url, status: 'pending' });
    }
  }

  /**
   * Отметить ассет как загруженный
   */
  markAssetLoaded(url: string): void {
    const asset = this.assets.get(url);
    if (asset) {
      asset.status = 'loaded';
    }
  }

  /**
   * Отметить ассет как ошибочный
   */
  markAssetError(url: string, error: Error): void {
    const asset = this.assets.get(url);
    if (asset) {
      asset.status = 'error';
      asset.error = error;
    }
  }

  /**
   * Загрузить изображения/текстуры
   */
  async loadTextures(urls: string[]): Promise<void> {
    if (urls.length === 0) return;

    this.isLoading = true;
    const startTime = Date.now();

    // Регистрация всех ассетов
    urls.forEach((url) => this.registerAsset(url));

    // Параллельная загрузка
    const promises = urls.map((url) => this.loadImage(url));
    await Promise.allSettled(promises);

    // Минимальное время показа
    const elapsed = Date.now() - startTime;
    if (elapsed < this.minDisplayTime) {
      await this.delay(this.minDisplayTime - elapsed);
    }

    runInAction(() => {
      this.isLoading = false;
    });
  }

  /**
   * Загрузить одно изображение
   */
  private async loadImage(url: string): Promise<void> {
    const asset = this.assets.get(url);
    if (!asset) return;

    runInAction(() => {
      asset.status = 'loading';
    });

    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        runInAction(() => {
          asset.status = 'loaded';
        });
        resolve();
      };

      img.onerror = () => {
        runInAction(() => {
          asset.status = 'error';
          asset.error = new Error(`Failed to load: ${url}`);
        });
        resolve();
      };

      img.src = url;
    });
  }

  /**
   * Сбросить состояние
   */
  reset(): void {
    this.assets.clear();
    this.isLoading = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
