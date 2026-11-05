import { resolve } from 'path';
import { defineConfig } from 'vite';

// Несколько страниц, чтобы npm run build собирал их все
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        catalog: resolve(import.meta.dirname, 'catalog.html'),
        product: resolve(import.meta.dirname, 'product.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        contacts: resolve(import.meta.dirname, 'contacts.html'),
      },
    },
  },
});