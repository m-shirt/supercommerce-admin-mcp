import { build } from "vite";
import { readdirSync, statSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const widgetsDir = resolve(process.cwd(), "src/widgets");
const assetsDir = resolve(process.cwd(), "assets");

// Ensure assets directory exists
try {
  mkdirSync(assetsDir, { recursive: true });
} catch (error) {
  // Directory already exists
}

interface WidgetBuildResult {
  name: string;
  html: string;
  css?: string;
  js: string;
}

async function buildWidget(widgetName: string, entryPath: string): Promise<WidgetBuildResult | null> {
  console.log(`\nBuilding widget: ${widgetName}`);

  try {
    const result = await build({
      plugins: [react(), tailwindcss()],
      build: {
        lib: false,
        rollupOptions: {
          input: {
            [widgetName]: entryPath,
          },
          output: {
            entryFileNames: `${widgetName}-[hash].js`,
            chunkFileNames: `${widgetName}-chunk-[hash].js`,
            assetFileNames: `${widgetName}-[hash].[ext]`,
          },
        },
        outDir: assetsDir,
        emptyOutDir: false,
        minify: true,
        sourcemap: false,
      },
      logLevel: "info",
    });

    if ('output' in result && Array.isArray(result.output)) {
      const jsFile = result.output.find((file) => file.type === "chunk" && file.name === widgetName);
      const cssFile = result.output.find((file) => file.type === "asset" && file.fileName.includes(".css"));

      if (!jsFile) {
        console.error(`No JS file generated for ${widgetName}`);
        return null;
      }

      const rootElementId = `${widgetName}-root`;

      let html = `<div id="${rootElementId}"></div>\n`;
      if (cssFile) {
        html += `<link rel="stylesheet" href="https://supercommerce-admin-mcp.vercel.app/assets/${cssFile.fileName}">\n`;
      }
      html += `<script type="module" src="https://supercommerce-admin-mcp.vercel.app/assets/${jsFile.fileName}"></script>`;

      return {
        name: widgetName,
        html: html.trim(),
        css: cssFile?.fileName,
        js: jsFile.fileName,
      };
    }

    return null;
  } catch (error) {
    console.error(`Failed to build ${widgetName}:`, error);
    return null;
  }
}

async function buildAllWidgets() {
  const items = readdirSync(widgetsDir);
  const buildResults: WidgetBuildResult[] = [];

  for (const item of items) {
    const itemPath = resolve(widgetsDir, item);

    if (!statSync(itemPath).isDirectory()) continue;
    if (item === "utils" || item === "shared") continue;

    // Look for index.jsx or index.tsx
    let entryPath: string | null = null;

    try {
      const jsxPath = resolve(itemPath, "index.jsx");
      if (statSync(jsxPath).isFile()) {
        entryPath = jsxPath;
      }
    } catch {
      try {
        const tsxPath = resolve(itemPath, "index.tsx");
        if (statSync(tsxPath).isFile()) {
          entryPath = tsxPath;
        }
      } catch {
        // No entry file found
      }
    }

    if (entryPath) {
      const result = await buildWidget(item, entryPath);
      if (result) {
        buildResults.push(result);
      }
    }
  }

  // Generate widget registry
  const registry = {
    widgets: buildResults.map((result) => ({
      name: result.name,
      templateUri: `ui://widget/${result.name}.html`,
      html: result.html,
      js: result.js,
      css: result.css,
    })),
    buildTime: new Date().toISOString(),
  };

  const registryPath = resolve(assetsDir, "widget-registry.json");
  writeFileSync(registryPath, JSON.stringify(registry, null, 2));

  console.log(`\n✅ Built ${buildResults.length} widgets`);
  console.log(`📋 Widget registry saved to: ${registryPath}\n`);

  buildResults.forEach((result) => {
    console.log(`  - ${result.name}: ${result.js}`);
  });
}

buildAllWidgets().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
