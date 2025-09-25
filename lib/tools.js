import { toolPaths } from "../tools/paths.js";

/**
 * Discovers and loads available tools from the tools directory
 * @returns {Promise<Array>} Array of tool objects
 */
export async function discoverTools() {
  const toolPromises = toolPaths.map(async (file) => {
    try {
      const module = await import(`../tools/${file}`);
      if (!module.apiTool) {
        console.warn(`Warning: No apiTool export found in ${file}`);
        return null;
      }
      return {
        ...module.apiTool,
        path: file,
      };
    } catch (error) {
      console.error(`Error loading tool ${file}:`, error.message);
      return null;
    }
  });
  const tools = await Promise.all(toolPromises);
  return tools.filter(tool => tool !== null);
}
