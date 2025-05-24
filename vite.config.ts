import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    base: isProduction ? './' : '/',
    
    // Development server configuration
    server: {
      host: '0.0.0.0',
      port: 3001,  // Changed from 3000 to 3001
      strictPort: true,
      open: true,
      hmr: true,
    },

    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: true,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          },
        },
      },
    },

    // Plugins
    plugins: [
      react({
        tsDecorators: true
      })
    ],

    // Resolve configuration
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});