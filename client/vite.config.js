import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { webcrypto } from 'crypto';

// Polyfill globalThis.crypto to Node.js crypto.webcrypto
globalThis.crypto = webcrypto;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
