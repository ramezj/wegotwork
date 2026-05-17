import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'url'

import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    mode === 'development' ? devtools() : undefined,
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      sitemap: {
        host: 'https://lunics.co',
      },
      pages: [
        {
          path: '/',
          sitemap: {
            priority: 1,
            changefreq: 'weekly',
          },
        },
        {
          path: '/features',
          sitemap: {
            priority: 0.8,
            changefreq: 'weekly',
          },
        },
        {
          path: '/pricing',
          sitemap: {
            priority: 0.8,
            changefreq: 'weekly',
          },
        },
        {
          path: '/auth',
          sitemap: {
            exclude: true,
          },
        },
      ],
    }),
    viteReact(),
  ].filter(Boolean),
}))

export default config
