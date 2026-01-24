/// <reference types='vitest' />

import path from 'node:path';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// Корень монорепо (2 уровня выше apps/massive-darkness-helper)
const workspaceRoot = path.resolve(import.meta.dirname, '../..');

export default defineConfig(({ mode }) => {
  // Загружаем env из корня монорепо
  const env = loadEnv(mode, workspaceRoot, '');

  return {
    root: import.meta.dirname,
    cacheDir: '../../node_modules/.vite/apps/massive-darkness-helper',
    server: {
      port: Number(env.MD_PORT) || 4001,
      host: '0.0.0.0', // Доступно в локальной сети
    },
    preview: {
      port: Number(env.MD_PORT) || 4001,
      host: '0.0.0.0',
    },
    plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
    build: {
      outDir: '../../dist/apps/massive-darkness-helper',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});
