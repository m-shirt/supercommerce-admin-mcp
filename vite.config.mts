import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { readdirSync, statSync } from "fs";

// Auto-discover widget entry points from src/widgets
function getWidgetEntries() {
  const widgetsDir = resolve(__dirname, "src/widgets");
  const entries: Record<string, string> = {};

  try {
    const items = readdirSync(widgetsDir);
    for (const item of items) {
      const itemPath = resolve(widgetsDir, item);
      if (statSync(itemPath).isDirectory()) {
        // Look for index.jsx or index.tsx
        const jsxPath = resolve(itemPath, "index.jsx");
        const tsxPath = resolve(itemPath, "index.tsx");

        try {
          if (statSync(jsxPath).isFile()) {
            entries[item] = jsxPath;
          } else if (statSync(tsxPath).isFile()) {
            entries[item] = tsxPath;
          }
        } catch {
          // File doesn't exist, skip
        }
      }
    }
  } catch (error) {
    console.warn("Could not read widgets directory:", error);
  }

  return entries;
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: getWidgetEntries(),
      output: {
        entryFileNames: "[name]-[hash].js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name]-[hash].[ext]",
      },
    },
    outDir: "assets",
    emptyOutDir: false,
  },
});
