import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'npmExists',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    target: 'node18',
    minify: false,
    rollupOptions: {
      external: [],
      output: {
        exports: 'named',
      },
    },
  },
})
