import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let widgetRegistry = null;

/**
 * Load widget registry from assets/widget-registry.json or public/assets/widget-registry.json
 */
export function loadWidgetRegistry() {
  if (widgetRegistry) return widgetRegistry;

  // Try multiple paths for flexibility
  const paths = [
    resolve(__dirname, "../public/assets/widget-registry.json"),
    resolve(__dirname, "../assets/widget-registry.json"),
    resolve(__dirname, "../../public/assets/widget-registry.json"),
  ];

  for (const registryPath of paths) {
    try {
      console.log(`[Widgets] Trying path: ${registryPath}`);
      const registryContent = readFileSync(registryPath, "utf-8");
      widgetRegistry = JSON.parse(registryContent);
      console.log(`✅ Widget registry loaded from: ${registryPath}`);
      console.log(`✅ Found ${widgetRegistry.widgets?.length || 0} widgets`);
      return widgetRegistry;
    } catch (error) {
      console.log(`[Widgets] Path not found: ${registryPath} (${error.message})`);
      // Try next path
      continue;
    }
  }

  console.warn("⚠️  Widget registry not found in any location. Run 'npm run build:widgets' to create widgets.");
  console.warn("⚠️  Searched paths:", paths);
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
