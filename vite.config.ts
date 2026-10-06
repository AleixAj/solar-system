import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    // Three.js breaks if two copies of it end up in the bundle: the postprocessing
    // packages must use the same instance as React Three Fiber.
    dedupe: ['three', '@react-three/fiber'],
  },
})
