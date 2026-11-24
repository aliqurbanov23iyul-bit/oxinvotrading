import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { resolveApiBaseUrl } from './src/config/public-config.ts';

export default defineConfig(({ mode, command, isPreview }) => {
  if (command === 'build' && process.env.NODE_ENV !== 'production') throw new Error('Frontend builds require NODE_ENV=production; demo workspace must not be bundled.');
  const publicEnv = loadEnv(mode, process.cwd(), 'VITE_');
  const permitted = new Set(['VITE_API_BASE_URL']);
  for (const key of Object.keys({ ...publicEnv, ...process.env })) {
    const vercelPublicMetadata = key === 'VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG' || /^VITE_VERCEL_(ENV|TARGET_ENV|URL|BRANCH_URL|PROJECT_PRODUCTION_URL|PROJECT_ID|ORG_ID|REGION|DEPLOYMENT_ID|GIT_(PROVIDER|REPO_SLUG|REPO_OWNER|REPO_ID|COMMIT_REF|COMMIT_SHA|COMMIT_MESSAGE|COMMIT_AUTHOR_LOGIN|COMMIT_AUTHOR_NAME|PREVIOUS_SHA|PULL_REQUEST_ID))$/.test(key);
    if (key.startsWith('VITE_') && !permitted.has(key) && !vercelPublicMetadata) throw new Error(`Unexpected public environment variable: ${key}. Only API URL and Vercel public metadata are allowed.`);
  }
  resolveApiBaseUrl(process.env.VITE_API_BASE_URL ?? publicEnv.VITE_API_BASE_URL, command === 'serve' && !isPreview);
  return {
    envPrefix: 'VITE_API_BASE_URL',
    build: { outDir: 'dist', sourcemap: false },
    plugins: [
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(import.meta.dirname, 'dist');
          const srcAssets = path.resolve(import.meta.dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:4000',
          changeOrigin: false,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : { ignored: ['**/backend/**', '**/.verification/**'] },
    },
  };
});

