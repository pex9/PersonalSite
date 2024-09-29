import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/PersonalSite/', // Set the base path to /site
  server: {
    host: '0.0.0.0', // Allows access from outside the container
    port: 3000,      // Set the port to 3000
  },
});