import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [
    react(),
    // 🚨 Do NOT include componentTagger() since it uses eval()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
}));

