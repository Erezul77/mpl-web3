import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mpl-web3/', // GitHub Pages base path - forces assets to load from correct path
  mode: 'production',
  build: {
    outDir: 'dist',
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
        // CSP-safe configuration
        format: 'es',
        inlineDynamicImports: false,
        // Avoid eval() usage
        hoistTransitiveImports: false,
        // Cache busting for assets
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  server: {
    port: 5173,
    open: true
  },
  // CSP-safe settings
  esbuild: {
    legalComments: 'none'
  }
})
