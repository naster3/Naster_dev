/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    testTimeout: 15000,
    hookTimeout: 15000,
    exclude: ['tests/e2e/**', 'playwright.config.ts'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/main.tsx',
        'src/**/index.ts',
        'src/app/App.tsx',
        'src/app/model/useBootLoader.ts',
        'src/app/model/theme.ts',
        'src/app/providers/AppProviders.tsx',
        'src/app/providers/ThemeProvider.tsx',
        'src/app/ui/**',
        'src/pages/home/ui/HomePage.tsx',
        'src/pages/not-found/ui/NotFoundPage.tsx',
        'src/pages/shared/ui/PageShell.tsx',
        'src/widgets/home-sections/model/content/**',
        'src/shared/i18n/context.ts',
        'src/shared/lib/analytics.ts',
        'src/widgets/home-sections/model/matrix/matrix-cube.ts',
        'src/widgets/home-sections/model/skills/**',
        'src/widgets/home-sections/model/contact/useContactForm.ts',
        'src/widgets/home-sections/model/matrix/matrix-rain-scene.ts',
        'src/widgets/home-sections/model/motion/useAnimationActivity.ts',
        'src/widgets/home-sections/model/matrix/useAsciiCubeOverlay.ts',
        'src/widgets/home-sections/model/matrix/useMatrixCubeCanvas.ts',
        'src/widgets/home-sections/ui/sections/ContactSection.tsx',
        'src/widgets/home-sections/ui/sections/HeroSection.tsx',
        'src/widgets/home-sections/ui/sections/HomeFooter.tsx',
        'src/widgets/home-sections/ui/sections/MatrixCubeSection.tsx',
        'src/widgets/home-sections/ui/sections/ProjectsSection.tsx',
        'src/widgets/home-sections/ui/sections/ScrollIndicator.tsx',
      ],
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90,
      },
    },
  },
})
