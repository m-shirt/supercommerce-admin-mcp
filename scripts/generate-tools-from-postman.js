#!/usr/bin/env node

/**
 * Automatic MCP Tool Generator from Postman Collection
 * This script analyzes the Postman collection and generates new MCP tools
 * for any APIs that don't already exist in the tools directory.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const POSTMAN_COLLECTION_PATH = path.join(__dirname, '../postman/collections/Backend APIs.postman_collection.json');
const TOOLS_DIR = path.join(__dirname, '../tools/supercommerce-api');
const PATHS_FILE = path.join(__dirname, '../tools/paths.js');

/**
 * Convert Postman request name to tool filename
 */
function convertToFileName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Convert Postman request name to function name
 */
function convertToFunctionName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+(.)/g, (match, char) => char.toUpperCase())
    .replace(/^\w/, c => c.toLowerCase());
}

/**
 * Generate MCP tool from Postman request
 */
function generateToolFromRequest(request, parentPath = '') {
  const method = request.request.method;
  const url = request.request.url;
  const headers = request.request.header || [];
  const body = request.request.body;

  // Parse URL
  let urlPath = '';
  let pathParams = [];

  if (url.raw) {
    urlPath = url.raw.replace('{{baseURL}}', '${baseURL}');
    // Extract path parameters
    const matches = urlPath.match(/\{\{([^}]+)\}\}/g);
    if (matches) {
      matches.forEach(match => {
        const param = match.replace(/[{}]/g, '');
        if (param !== 'baseURL' && param !== 'token') {
          pathParams.push(param);
          urlPath = urlPath.replace(match, '${' + param + '}');
        }
      });
    }
  }

  // Parse query parameters
  const queryParams = url.query || [];

  // Parse body parameters
  let bodyParams = [];
  if (body && body.mode === 'raw' && body.raw) {
    try {
      const jsonBody = JSON.parse(body.raw);
      bodyParams = Object.keys(jsonBody);
    } catch (e) {
      // Not JSON, might be form data or other format
    }
  }

  const fileName = convertToFileName(request.name);
  const functionName = convertToFunctionName(request.name);

  // Generate the tool code
  const toolCode = `/**
 * Function to ${request.name.toLowerCase()}.
 *
 * @param {Object} params - The parameters for ${request.name.toLowerCase()}.
${pathParams.map(p => ` * @param {string} params.${p} - The ${p.replace(/_/g, ' ')}.`).join('\n')}
${queryParams.map(q => ` * @param {${q.value ? 'string' : 'string'}} [params.${q.key}] - ${q.description || q.key.replace(/_/g, ' ')}.`).join('\n')}
${bodyParams.map(b => ` * @param {string} [params.${b}] - The ${b.replace(/_/g, ' ')}.`).join('\n')}
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
${[...pathParams, ...queryParams.map(q => q.key), ...bodyParams].map(p => `      ${p},`).join('\n')}
    } = params;

    ${pathParams.length > 0 ? `let url = \`${urlPath}\`;` : `const url = \`${urlPath}\`;`}
    ${queryParams.length > 0 ? `
    const queryParams = new URLSearchParams();
${queryParams.map(q => `    if (${q.key} !== undefined) queryParams.append('${q.key}', ${q.key});`).join('\n')}
    const queryString = queryParams.toString();
    if (queryString) url += \`?\${queryString}\`;` : ''}

    const headers = {
      'Authorization': \`Bearer \${token}\`,
      'Accept': 'application/json'${method !== 'GET' && method !== 'DELETE' ? `,
      'Content-Type': 'application/json'` : ''}
    };

    ${bodyParams.length > 0 ? `const requestData = {
${bodyParams.map(b => `      ${b},`).join('\n')}
    };` : ''}

    const response = await fetch(url, {
      method: '${method}',
      headers${bodyParams.length > 0 ? `,
      body: JSON.stringify(requestData)` : ''}
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Error in ${functionName}:', error);
    return { error: error.message || 'An error occurred during the operation.' };
  }
};

/**
 * Tool configuration for ${request.name.toLowerCase()}.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: '${functionName.replace(/[A-Z]/g, '_$&').toLowerCase().replace(/^_/, '')}',
      description: '${request.name}',
      parameters: {
        type: 'object',
        properties: {
${[...pathParams.map(p => `          ${p}: {
            type: 'string',
            description: 'The ${p.replace(/_/g, ' ')}'
          }`),
   ...queryParams.map(q => `          ${q.key}: {
            type: '${q.value ? 'string' : 'string'}',
            description: '${q.description || q.key.replace(/_/g, ' ')}'
          }`),
   ...bodyParams.map(b => `          ${b}: {
            type: 'string',
            description: 'The ${b.replace(/_/g, ' ')}'
          }`)].join(',\n')}
        },
        required: [${pathParams.map(p => `'${p}'`).join(', ')}]
      }
    }
  }
};

export { apiTool };`;

  return {
    fileName: `${fileName}.js`,
    code: toolCode,
    functionName,
    request
  };
}

/**
 * Process Postman collection and generate tools
 */
function processCollection(collection) {
  const newTools = [];
  const existingTools = new Set();

  // Get existing tool files
  if (fs.existsSync(TOOLS_DIR)) {
    const files = fs.readdirSync(TOOLS_DIR);
    files.forEach(file => {
      if (file.endsWith('.js')) {
        existingTools.add(file);
      }
    });
  }

  // Process collection items recursively
  function processItem(item, parentPath = '') {
    if (item.item) {
      // It's a folder
      item.item.forEach(subItem => {
        processItem(subItem, `${parentPath}/${item.name}`);
      });
    } else if (item.request) {
      // It's a request
      const tool = generateToolFromRequest(item, parentPath);

      // Check if tool already exists
      if (!existingTools.has(tool.fileName)) {
        newTools.push(tool);
        console.log(`✅ New tool to generate: ${tool.fileName}`);
      } else {
        console.log(`⏭️  Tool already exists: ${tool.fileName}`);
      }
    }
  }

  collection.item.forEach(item => processItem(item));

  return newTools;
}

/**
 * Update paths.js file
 */
function updatePathsFile(newTools) {
  if (newTools.length === 0) return;

  let pathsContent = fs.readFileSync(PATHS_FILE, 'utf8');

  // Find the end of the array
  const endMatch = pathsContent.match(/\n\];/);
  if (!endMatch) {
    console.error('Could not find end of paths array');
    return;
  }

  // Add new tool paths
  const newPaths = newTools.map(tool => `  'supercommerce-api/${tool.fileName.replace('.js', '.js')}',`).join('\n');

  // Insert before the closing bracket
  pathsContent = pathsContent.replace(
    /\n\];/,
    `,\n\n  // Auto-generated tools - ${new Date().toISOString()}\n${newPaths}\n\n];`
  );

  fs.writeFileSync(PATHS_FILE, pathsContent);
  console.log(`✅ Updated paths.js with ${newTools.length} new tools`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 Starting Postman to MCP Tool Generation...\n');

  // Check if collection exists
  if (!fs.existsSync(POSTMAN_COLLECTION_PATH)) {
    console.error('❌ Postman collection not found at:', POSTMAN_COLLECTION_PATH);
    process.exit(1);
  }

  // Read and parse collection
  const collectionData = fs.readFileSync(POSTMAN_COLLECTION_PATH, 'utf8');
  const collection = JSON.parse(collectionData);

  console.log(`📚 Analyzing collection: ${collection.info.name}\n`);

  // Process collection
  const newTools = processCollection(collection);

  if (newTools.length === 0) {
    console.log('\n✅ All tools are up to date! No new tools to generate.');
    return;
  }

  console.log(`\n🛠️  Generating ${newTools.length} new tools...\n`);

  // Create tools directory if it doesn't exist
  if (!fs.existsSync(TOOLS_DIR)) {
    fs.mkdirSync(TOOLS_DIR, { recursive: true });
  }

  // Generate tool files
  newTools.forEach(tool => {
    const filePath = path.join(TOOLS_DIR, tool.fileName);
    fs.writeFileSync(filePath, tool.code);
    console.log(`📝 Generated: ${tool.fileName}`);
  });

  // Update paths.js
  updatePathsFile(newTools);

  console.log('\n🎉 Tool generation complete!');
  console.log(`Generated ${newTools.length} new MCP tools from Postman collection.`);

  // Return summary for CI/CD
  return {
    success: true,
    newToolsCount: newTools.length,
    newTools: newTools.map(t => t.fileName)
  };
}

// Run if executed directly
if (import.meta.url === `file://${__filename}`) {
  main().catch(console.error);
}

export { main, generateToolFromRequest, processCollection };