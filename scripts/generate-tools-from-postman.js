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

// Configuration - Use the first JSON file in collections directory
const collectionsDir = path.join(__dirname, '../postman/collections');
const collectionFiles = fs.existsSync(collectionsDir)
  ? fs.readdirSync(collectionsDir).filter(f => f.endsWith('.json'))
  : [];
const POSTMAN_COLLECTION_PATH = collectionFiles.length > 0
  ? path.join(collectionsDir, collectionFiles[0])
  : path.join(__dirname, '../postman/collections/Backend APIs.postman_collection.json');
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

  if (url && url.raw) {
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
  } else if (url && url.host && url.path) {
    // Fallback for older Postman format
    urlPath = '${baseURL}' + (url.path ? '/' + url.path.join('/') : '');
  } else {
    console.warn(`Warning: Request "${request.name}" has no valid URL format, skipping...`);
    return null;
  }

  // Parse query parameters
  const queryParams = (url && url.query) || [];

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

  // Sanitize parameter names (replace hyphens with underscores for valid JS variables)
  const sanitizeName = (name) => name.replace(/-/g, '_');

  // Combine all parameters and remove duplicates
  const allParams = [...new Set([...pathParams.map(sanitizeName), ...queryParams.map(q => sanitizeName(q.key)), ...bodyParams.map(sanitizeName)])];

  // Generate the tool code
  const toolCode = `/**
 * Function to ${request.name.toLowerCase()}.
 *
 * @param {Object} params - The parameters for ${request.name.toLowerCase()}.
${pathParams.map(p => ` * @param {string} params.${sanitizeName(p)} - The ${p.replace(/_/g, ' ')}.`).join('\n')}
${queryParams.map(q => ` * @param {${q.value ? 'string' : 'string'}} [params.${sanitizeName(q.key)}] - ${q.description || q.key.replace(/_/g, ' ')}.`).join('\n')}
${bodyParams.map(b => ` * @param {string} [params.${sanitizeName(b)}] - The ${b.replace(/_/g, ' ')}.`).join('\n')}
 * @returns {Promise<Object>} - The result of the operation.
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  try {
    const {
${allParams.map(p => `      ${p},`).join('\n')}
    } = params;

    ${pathParams.length > 0 || queryParams.length > 0 ? `let url = \`${urlPath}\`;` : `const url = \`${urlPath}\`;`}
    ${queryParams.length > 0 ? `
    const queryParams = new URLSearchParams();
${queryParams.map(q => `    if (${sanitizeName(q.key)} !== undefined) queryParams.append('${q.key}', ${sanitizeName(q.key)});`).join('\n')}
    const queryString = queryParams.toString();
    if (queryString) url += \`?\${queryString}\`;` : ''}

    const headers = {
      'Authorization': \`Bearer \${token}\`,
      'Accept': 'application/json'${method !== 'GET' && method !== 'DELETE' ? `,
      'Content-Type': 'application/json'` : ''}
    };

    ${bodyParams.length > 0 ? `const requestData = {
${bodyParams.map(b => `      '${b}': ${sanitizeName(b)},`).join('\n')}
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
${[...pathParams.map(p => `          ${sanitizeName(p)}: {
            type: 'string',
            description: 'The ${p.replace(/_/g, ' ')}'
          }`),
   ...queryParams.filter(q => !pathParams.includes(q.key) && !bodyParams.includes(q.key)).map(q => `          ${sanitizeName(q.key)}: {
            type: '${q.value ? 'string' : 'string'}',
            description: '${q.description || q.key.replace(/_/g, ' ')}'
          }`),
   ...bodyParams.filter(b => !pathParams.includes(b)).map(b => `          ${sanitizeName(b)}: {
            type: 'string',
            description: 'The ${b.replace(/_/g, ' ')}'
          }`)].join(',\n')}
        },
        required: [${pathParams.map(p => `'${sanitizeName(p)}'`).join(', ')}]
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

  // Track updated tools separately
  const updatedTools = [];

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

      // Skip if tool generation failed
      if (!tool) {
        return;
      }

      // Check if tool already exists
      if (!existingTools.has(tool.fileName)) {
        newTools.push(tool);
        console.log(`✅ New tool to generate: ${tool.fileName}`);
      } else {
        // Always add to updated tools list (auto-update by default)
        updatedTools.push(tool);
        console.log(`🔄 Tool will be updated (with backup): ${tool.fileName}`);
      }
    }
  }

  collection.item.forEach(item => processItem(item));

  return { newTools, updatedTools };
}

/**
 * Generate documentation for tools
 */
function generateDocumentation(newTools, updatedTools) {
  const docsPath = path.join(__dirname, '../docs/TOOLS.md');
  const toolsDir = path.join(__dirname, '../tools/supercommerce-api');

  let documentation = `# SuperCommerce MCP Tools Documentation

## Overview

This document provides comprehensive documentation for all ${fs.readdirSync(toolsDir).filter(f => f.endsWith('.js')).length} MCP tools available in the SuperCommerce Admin API integration.

Last Updated: ${new Date().toISOString()}

## Business Model Categories

`;

  // Define business domain categories
  const domainCategories = {
    'Authentication': ['login', 'forget-password'],
    'Products': ['product', 'variant', 'main-product', 'details-product'],
    'Categories': ['category', 'subcategor'],
    'Brands': ['brand'],
    'Options': ['option'],
    'Orders': ['order', 'list-orders', 'view-order', 'create-order', 'edit-order'],
    'Customers': ['customer', 'address'],
    'Groups': ['group'],
    'Custom Lists': ['custom-list', 'cutom-list'],
    'Inventory': ['inventories'],
    'Promotions': ['promo', 'promotion', 'reward'],
    'Campaigns': ['campaign'],
    'Notifications': ['notification'],
    'Delivery': ['delivery', 'pickup', 'manager'],
    'Branches': ['branch'],
    'Areas & Locations': ['governorate', 'area', 'cities'],
    'Sections': ['section'],
    'Ads & Sliders': ['ads', 'slider', 'custom-ad'],
    'Pages & Content': ['page', 'static', 'website', 'terms', 'privacy', 'cookies'],
    'Menu': ['menu'],
    'Transactions': ['transaction'],
    'Contact & Support': ['contact'],
    'Prescriptions': ['prescription'],
    'Utilities': ['payment-method', 'cancellation-reason', 'order-status', 'image', 'type']
  };

  // Group tools by business domain
  const categories = {};
  const allTools = fs.readdirSync(toolsDir).filter(f => f.endsWith('.js'));

  // Initialize categories
  Object.keys(domainCategories).forEach(domain => {
    categories[domain] = [];
  });

  allTools.forEach(file => {
    const toolName = file.replace('.js', '');
    let assigned = false;

    // Check which domain this tool belongs to
    for (const [domain, keywords] of Object.entries(domainCategories)) {
      if (keywords.some(keyword => toolName.includes(keyword))) {
        categories[domain].push(toolName);
        assigned = true;
        break;
      }
    }

    // If not assigned to any domain, put in Other
    if (!assigned) {
      if (!categories['Other']) {
        categories['Other'] = [];
      }
      categories['Other'].push(toolName);
    }
  });

  // Write category sections
  Object.keys(categories).forEach(domain => {
    if (categories[domain].length > 0) {
      documentation += `### ${domain} (${categories[domain].length} tools)\n\n`;

      categories[domain].sort().forEach(tool => {
        documentation += `- \`${tool.replace(/-/g, '_')}\` - ${tool.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
      });

      documentation += '\n';
    }
  });

  // Add new tools section if any
  if (newTools.length > 0) {
    documentation += `## 🆕 Recently Added Tools\n\n`;
    newTools.forEach(tool => {
      documentation += `- \`${tool.functionName}\` - ${tool.request.name}\n`;
    });
    documentation += '\n';
  }

  // Add updated tools section if any
  if (updatedTools.length > 0) {
    documentation += `## 🔄 Recently Updated Tools\n\n`;
    updatedTools.forEach(tool => {
      documentation += `- \`${tool.functionName}\` - ${tool.request.name}\n`;
    });
    documentation += '\n';
  }

  // Create docs directory if it doesn't exist
  const docsDir = path.dirname(docsPath);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  fs.writeFileSync(docsPath, documentation);
  console.log(`📚 Documentation updated: docs/TOOLS.md`);
}

/**
 * Update changelog with new and updated tools
 */
function updateChangelog(newTools, updatedTools) {
  const changelogPath = path.join(__dirname, '../CHANGELOG.md');
  const date = new Date().toISOString().split('T')[0];

  let changelogEntry = '';

  if (newTools.length > 0 || updatedTools.length > 0) {
    changelogEntry = `\n## [Automated Update] - ${date}\n\n`;

    if (newTools.length > 0) {
      changelogEntry += `### ✨ Added\n`;
      newTools.forEach(tool => {
        changelogEntry += `- \`${tool.functionName}\` - ${tool.request.name}\n`;
      });
      changelogEntry += '\n';
    }

    if (updatedTools.length > 0) {
      changelogEntry += `### 🔄 Updated\n`;
      updatedTools.forEach(tool => {
        changelogEntry += `- \`${tool.functionName}\` - Updated from Postman collection\n`;
      });
      changelogEntry += '\n';
    }

    changelogEntry += `### 📊 Summary\n`;
    changelogEntry += `- Total new tools: ${newTools.length}\n`;
    changelogEntry += `- Total updated tools: ${updatedTools.length}\n`;
    changelogEntry += `- Timestamp: ${new Date().toISOString()}\n\n---\n`;
  }

  // Read existing changelog or create new one
  let existingChangelog = '';
  if (fs.existsSync(changelogPath)) {
    existingChangelog = fs.readFileSync(changelogPath, 'utf8');
  } else {
    existingChangelog = `# Changelog\n\nAll notable changes to the SuperCommerce MCP Tools are documented here.\n\n---\n`;
  }

  // Insert new entry after header
  const headerEnd = existingChangelog.indexOf('---\n') + 4;
  const updatedChangelog =
    existingChangelog.slice(0, headerEnd) +
    changelogEntry +
    existingChangelog.slice(headerEnd);

  fs.writeFileSync(changelogPath, updatedChangelog);
  console.log(`📝 Changelog updated: CHANGELOG.md`);
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
  const { newTools, updatedTools } = processCollection(collection);

  // Check if skip-update flag is set (default is to update)
  const skipUpdates = process.env.SKIP_TOOL_UPDATES === 'true' || process.argv.includes('--skip-updates');

  if (newTools.length === 0 && updatedTools.length === 0) {
    console.log('\n✅ All tools are up to date! No changes needed.');
    return;
  }

  // Create tools directory if it doesn't exist
  if (!fs.existsSync(TOOLS_DIR)) {
    fs.mkdirSync(TOOLS_DIR, { recursive: true });
  }

  // Create backups directory
  const backupsDir = path.join(__dirname, '../tools/backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  let generatedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  // Generate new tool files
  if (newTools.length > 0) {
    console.log(`\n🛠️  Generating ${newTools.length} new tools...\n`);
    newTools.forEach(tool => {
      const filePath = path.join(TOOLS_DIR, tool.fileName);
      fs.writeFileSync(filePath, tool.code);
      console.log(`📝 Generated: ${tool.fileName}`);
      generatedCount++;
    });
  }

  // Update existing tool files (default behavior, unless skipped)
  if (updatedTools.length > 0) {
    if (skipUpdates) {
      console.log(`\n⏭️  Skipping ${updatedTools.length} tool updates (--skip-updates flag set)\n`);
      updatedTools.forEach(tool => {
        console.log(`⏭️  Skipped update: ${tool.fileName}`);
        skippedCount++;
      });
    } else {
      console.log(`\n🔄 Auto-updating ${updatedTools.length} existing tools with backups...\n`);
      updatedTools.forEach(tool => {
        const filePath = path.join(TOOLS_DIR, tool.fileName);

        // Create timestamped backup of existing tool
        if (fs.existsSync(filePath)) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const backupFileName = tool.fileName.replace('.js', `_${timestamp}.backup.js`);
          const backupPath = path.join(backupsDir, backupFileName);

          fs.copyFileSync(filePath, backupPath);
          console.log(`💾 Backup saved: backups/${backupFileName}`);
        }

        // Update the tool
        fs.writeFileSync(filePath, tool.code);
        console.log(`🔄 Updated: ${tool.fileName}`);
        updatedCount++;
      });
    }
  }

  // Update paths.js only for new tools
  if (newTools.length > 0) {
    updatePathsFile(newTools);
  }

  console.log('\n🎉 Tool processing complete!');
  if (generatedCount > 0) {
    console.log(`✅ Generated ${generatedCount} new MCP tools`);
  }
  if (updatedCount > 0) {
    console.log(`🔄 Auto-updated ${updatedCount} existing MCP tools (backups in tools/backups/)`);
  }
  if (skippedCount > 0) {
    console.log(`⏭️  Skipped ${skippedCount} tool updates (--skip-updates flag was set)`);
  }

  if (updatedCount > 0) {
    console.log(`\n💡 Tip: All backups are stored in tools/backups/ with timestamps`);
    console.log(`   To restore: cp tools/backups/[backup-file] tools/supercommerce-api/[original-name]`);
  }

  // Generate documentation and changelog
  if (generatedCount > 0 || updatedCount > 0) {
    generateDocumentation(newTools, updatedTools);
    updateChangelog(newTools, updatedTools);
  }

  // Return summary for CI/CD
  return {
    success: true,
    newToolsCount: generatedCount,
    updatedToolsCount: updatedCount,
    newTools: newTools.map(t => t.fileName),
    updatedTools: updatedTools.map(t => t.fileName)
  };
}

// Run if executed directly
if (import.meta.url === `file://${__filename}`) {
  main().catch(console.error);
}

export { main, generateToolFromRequest, processCollection };