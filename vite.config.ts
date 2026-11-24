import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { ApiEnvironmentMode, resolveApiBaseUrl } from './src/config/public-config.ts';

export default defineConfig(({ mode, command, isPreview, isSsrBuild }) => {
  const publicEnv = loadEnv(mode, process.cwd(), 'VITE_');
  const permitted = new Set(['VITE_API_BASE_URL']);
  for (const key of Object.keys({ ...publicEnv, ...process.env })) {
    const vercelPublicMetadata =
      key === 'VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG' ||
      /^VITE_VERCEL_(ENV|TARGET_ENV|URL|BRANCH_URL|PROJECT_PRODUCTION_URL|PROJECT_ID|ORG_ID|REGION|DEPLOYMENT_ID|GIT_(PROVIDER|REPO_SLUG|REPO_OWNER|REPO_ID|COMMIT_REF|COMMIT_SHA|COMMIT_MESSAGE|COMMIT_AUTHOR_LOGIN|COMMIT_AUTHOR_NAME|PREVIOUS_SHA|PULL_REQUEST_ID))$/.test(
        key,
      );
    if (key.startsWith('VITE_') && !permitted.has(key) && !vercelPublicMetadata) {
      throw new Error(
        `Unexpected public environment variable: ${key}. Only API URL and Vercel public metadata are allowed.`,
      );
    }
  }

  const vercelEnv = process.env.VERCEL_ENV || publicEnv.VITE_VERCEL_ENV;
  const isDevServe = command === 'serve' && !isPreview;
  let envMode: ApiEnvironmentMode = 'production';
  if (isSsrBuild) {
    envMode = 'ssr';
  } else if (isDevServe) {
    envMode = 'development';
  } else if (isPreview || vercelEnv === 'preview' || vercelEnv === 'development' || !process.env.VERCEL) {
    // Vercel Preview or standalone build (including AI Studio build without external API domain configured)
    envMode = vercelEnv === 'production' ? 'production' : 'preview';
  }

  const previewHost = process.env.VERCEL_URL || publicEnv.VITE_VERCEL_URL;
  resolveApiBaseUrl(process.env.VITE_API_BASE_URL ?? publicEnv.VITE_API_BASE_URL, isDevServe, envMode, previewHost);

  return {
    envPrefix: ['VITE_API_BASE_URL', 'VITE_VERCEL_ENV'],
    build: { outDir: 'dist', sourcemap: false },
    plugins: [
      react(),
      tailwindcss(),
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
            fs.cpSync(srcAssets, distAssets, { recursive: true, force: true });
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
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : { ignored: ['**/backend/**', '**/.verification/**'] },
    },
  };
});
