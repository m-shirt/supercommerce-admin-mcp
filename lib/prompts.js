import { promptPaths } from "../prompts/paths.js";

/**
 * Discovers and loads available prompts from the prompts directory
 * @returns {Promise<Array>} Array of prompt objects
 */
export async function discoverPrompts() {
  const promptPromises = promptPaths.map(async (file) => {
    const module = await import(`../prompts/${file}`);
    return {
      ...module.default,
      path: file,
    };
  });
  return Promise.all(promptPromises);
}
