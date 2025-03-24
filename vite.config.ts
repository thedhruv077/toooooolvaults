
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Remove or update the base path - this is likely causing the white screen
  // base: "/toooooolvaults/", 
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Content-Security-Policy": "script-src 'self' 'unsafe-eval' 'unsafe-inline'; object-src 'none';",
    },
  },
  plugins: [
    react(),
    // Removed componentTagger() to avoid eval issue
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
