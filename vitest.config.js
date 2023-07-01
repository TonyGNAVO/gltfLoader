import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [],
    root: 'src/',
    test: {
        globals: true,
        environment: 'happy-dom',
    },
});
