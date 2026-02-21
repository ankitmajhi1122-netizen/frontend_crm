import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': resolve(__dirname, 'src/app'),
      '@auth': resolve(__dirname, 'src/auth'),
      '@core': resolve(__dirname, 'src/core'),
      '@modules': resolve(__dirname, 'src/modules'),
      '@shared': resolve(__dirname, 'src/shared'),
      '@data': resolve(__dirname, 'src/data'),
      '@store': resolve(__dirname, 'src/store'),
      '@multi-tenant': resolve(__dirname, 'src/multi-tenant'),
    },
  },
});
