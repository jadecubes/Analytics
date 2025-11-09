/// <reference types='vitest' />
import { resolve } from 'path'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/AnalyticsApp',

    server: {
      port: 3000,
      host: 'localhost',
      fs: {
        cachedChecks: false,
      },
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    /**
     * To fix absolute paths in scss
     * https://stackoverflow.com/questions/70632978/is-there-a-way-so-i-can-use-absolute-paths-in-scss-using-vite
     */
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src'),
      },
    },
    plugins: [react(), nxViteTsPaths(), svgr()],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    envPrefix: ['REACT_APP_'],

    build: {
      outDir: '../../dist/apps/analyticsApp',
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },

    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        reportsDirectory: '../../coverage/apps/analyticsApp',
      },
    },
  }
})
