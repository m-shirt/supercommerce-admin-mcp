import { resourcePaths } from "../resources/paths.js";

/**
 * Discovers and loads available widget resources from the resources directory
 * Similar pattern to tools and prompts discovery
 * @returns {Promise<Array>} Array of widget resource objects
 */
export async function discoverResources() {
  console.log(`[Resources] Starting discovery of ${resourcePaths.length} resources...`);

  const resourcePromises = resourcePaths.map(async (file) => {
    try {
      console.log(`[Resources] Loading: ${file}`);
      const module = await import(`../resources/${file}`);

      if (!module.widgetResource) {
        console.warn(`[Resources] Warning: No widgetResource export found in ${file}`);
        return null;
      }

      console.log(`[Resources] ✅ Loaded: ${module.widgetResource.name}`);

      return {
        ...module.widgetResource,
        path: file,
      };
    } catch (error) {
      console.error(`[Resources] Error loading resource ${file}:`, error.message);
      return null;
    }
  });

  const resources = await Promise.all(resourcePromises);
  const validResources = resources.filter(resource => resource !== null);

  console.log(`[Resources] ✅ Discovery complete: ${validResources.length} resources loaded`);

  return validResources;
}

/**
 * Get resource content by URI
 * @param {string} uri - Resource URI (e.g., "ui://widget/product-creation.html")
 * @param {Array} resources - Array of loaded resources
 * @returns {Object} Resource content
 */
export function getResourceByUri(uri, resources) {
  const resource = resources.find(r => r.uri === uri);

  if (!resource) {
    throw new Error(`Resource not found: ${uri}`);
  }

  return {
    uri: resource.uri,
    mimeType: resource.mimeType,
    text: resource.text,
    _meta: resource._meta,
  };
}
