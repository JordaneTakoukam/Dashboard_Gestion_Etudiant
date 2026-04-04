import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // écoute sur toutes les interfaces réseau
    port: 5173,        // ou le port que tu utilises
  }
})