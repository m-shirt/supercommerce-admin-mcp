// Debug endpoint for Vercel deployment issues

export default async function handler(req, res) {
  try {
    // Basic environment info
    const envInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      cwd: process.cwd(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
      }
    };

    // Test tool loading
    let toolsInfo = {};
    try {
      const { discoverTools } = await import('../../lib/tools.js');
      const tools = await discoverTools();
      toolsInfo = {
        success: true,
        count: tools.length,
        hasValidDefinitions: tools.every(t => t.function && t.definition),
        sampleTool: tools[0] ? {
          hasFunction: !!tools[0].function,
          hasDefinition: !!tools[0].definition,
          name: tools[0].definition?.function?.name
        } : null
      };
    } catch (error) {
      toolsInfo = {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }

    // Test paths.js loading
    let pathsInfo = {};
    try {
      const { toolPaths } = await import('../../tools/paths.js');
      pathsInfo = {
        success: true,
        count: toolPaths.length,
        isArray: Array.isArray(toolPaths),
        sample: toolPaths.slice(0, 3)
      };
    } catch (error) {
      pathsInfo = {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envInfo,
      tools: toolsInfo,
      paths: pathsInfo
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      stack: error.stack
    });
  }
}