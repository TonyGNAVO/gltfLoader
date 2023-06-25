import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    root: "src/UI/App",
    css: {
        modules: {
            localsConvention: "camelCase",
        },
    },
});
