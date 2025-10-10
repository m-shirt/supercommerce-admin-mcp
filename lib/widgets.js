import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let widgetRegistry = null;

/**
 * Load widget registry from assets/widget-registry.json
 * For Vercel serverless, this needs to be in a location that's bundled with the function
 */
export function loadWidgetRegistry() {
  if (widgetRegistry) return widgetRegistry;

  // Try multiple paths (in priority order for Vercel)
  const paths = [
    // Vercel serverless (project root - this gets bundled)
    resolve(process.cwd(), "widget-registry.json"),
    // Local development (assets directory)
    resolve(process.cwd(), "assets/widget-registry.json"),
    resolve(__dirname, "../assets/widget-registry.json"),
    // Public directory (for static serving)
    resolve(process.cwd(), "public/assets/widget-registry.json"),
    resolve(__dirname, "../public/assets/widget-registry.json"),
  ];

  for (const registryPath of paths) {
    try {
      const registryContent = readFileSync(registryPath, "utf-8");
      widgetRegistry = JSON.parse(registryContent);
      console.log(`✅ Widget registry loaded from: ${registryPath}`);
      console.log(`✅ Found ${widgetRegistry.widgets?.length || 0} widgets`);
      return widgetRegistry;
    } catch (error) {
      // Try next path silently
      continue;
    }
  }

  console.warn("⚠️  Widget registry not found. Widgets will not be available.");
  console.warn("⚠️  Working directory:", process.cwd());
  return { widgets: [] };
}

/**
 * Get widget metadata for a specific widget name
 */
export function getWidgetMeta(widgetName) {
  const registry = loadWidgetRegistry();
  const widget = registry.widgets.find((w) => w.name === widgetName);

  if (!widget) {
    return null;
  }

  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": `Creating ${widgetName.replace(/-/g, " ")}...`,
    "openai/toolInvocation/invoked": `${widgetName.replace(/-/g, " ")} created successfully`,
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true,
  };
}

/**
 * Get all widgets as MCP resources
 */
export function getWidgetResources() {
  const registry = loadWidgetRegistry();

  return registry.widgets.map((widget) => ({
    uri: widget.templateUri,
    name: widget.name,
    description: `${widget.name} widget template`,
    mimeType: "text/html+skybridge",
    _meta: getWidgetMeta(widget.name),
  }));
}

/**
 * Get resource content by URI
 */
export function getResourceContent(uri) {
  const registry = loadWidgetRegistry();
  const widget = registry.widgets.find((w) => w.templateUri === uri);

  if (!widget) {
    throw new Error(`Widget not found for URI: ${uri}`);
  }

  return {
    uri: widget.templateUri,
    mimeType: "text/html+skybridge",
    text: widget.html,
    _meta: getWidgetMeta(widget.name),
  };
}

/**
 * Attach widget metadata to a tool response
 */
export function attachWidgetToResponse(response, widgetName) {
  const meta = getWidgetMeta(widgetName);

  if (!meta) {
    return response;
  }

  return {
    ...response,
    _meta: meta,
  };
}
