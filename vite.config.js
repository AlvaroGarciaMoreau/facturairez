import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/facturairez/', // Garantiza rutas relativas para assets y scripts
});