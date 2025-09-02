import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  define: {
    // Define process.env for browser
    "process.env": {},
    "process.env.NODE_ENV": JSON.stringify("production"),
  },

  build: {
    lib: {
      entry: resolve(__dirname, "src/widget.tsx"),
      name: "BundleWidget",
      fileName: "widget",
      formats: ["umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    // Ensure browser compatibility
    target: "es2015",
    minify: "terser",
  },
});
