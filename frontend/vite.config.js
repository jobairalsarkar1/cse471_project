import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: "/",
  server: {
    // proxy: {
    //   "/api": "http://localhost:5000",
    // },
    historyApiFallback: true,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "index.html",
    },
  },
  // server: {
  //   host: "0.0.0.0",
  //   port: 5000,
  //   proxy: {
  //     "/api": "http://localhost:5000",
  //   },
  // },
});
