import { defineConfig } from "vite";
import history from "connect-history-api-fallback";

// 📦 Vite configuration for Elimu-Online SPA
export default defineConfig({
  root: "./", // 📁 Set root directory for the frontend

  server: {
    port: 5173, // 🌐 Dev server port
    open: true, // 🚀 Automatically open in browser on start
  },

  plugins: [
    {
      name: "spa-fallback", // 🔁 Plugin for handling SPA routes
      configureServer(server) {
        server.middlewares.use(
          history({
            disableDotRule: true, // ✅ Allows dots in URL paths (e.g., /reset-password)
            htmlAcceptHeaders: ["text/html", "application/xhtml+xml"], // 📄 Accept headers for fallback
          })
        );
      },
    },
  ],
});
