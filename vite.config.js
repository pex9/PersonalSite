import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/site/', // Set this to your repository name,
  port: 3000, //set this to your desired port for local docker
});
