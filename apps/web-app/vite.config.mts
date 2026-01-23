/// <reference types='vitest' />

import path from 'node:path';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// Корень монорепо (2 уровня выше apps/web-app)
const workspaceRoot = path.resolve(import.meta.dirname, '../..');

export default defineConfig(({ mode }) => {
  // Загружаем env из корня монорепо
  const env = loadEnv(mode, workspaceRoot, '');

  return {
    root: import.meta.dirname,
    cacheDir: '../../node_modules/.vite/apps/web-app',
    server: {
      port: Number(env.PORT) || 4000,
      host: env.HOST || 'localhost',
    },
    preview: {
      port: Number(env.PORT) || 4000,
      host: env.HOST || 'localhost',
    },
    plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
    // Uncomment this if you are using workers.
    // worker: {
    //   plugins: () => [ nxViteTsPaths() ],
    // },
    build: {
      outDir: '../../dist/apps/web-app',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});
