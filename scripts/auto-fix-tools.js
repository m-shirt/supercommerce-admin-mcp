#!/usr/bin/env node

/**
 * Auto-fix script for common tool validation issues
 * This script automatically fixes:
 * - Duplicate tool entries
 * - Syntax errors in paths.js
 * - Missing trailing commas
 * - Improper formatting
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ToolAutoFix {
  constructor() {
    this.pathsFile = './tools/paths.js';
    this.changes = [];
  }

  log(message, type = 'info') {
    const prefix = type === 'error' ? '❌' : type === 'fix' ? '🔧' : 'ℹ️';
    console.log(`${prefix} ${message}`);
  }

  readPathsFile() {
    try {
      return fs.readFileSync(this.pathsFile, 'utf8');
    } catch (error) {
      this.log(`Failed to read ${this.pathsFile}: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  writePathsFile(content) {
    try {
      fs.writeFileSync(this.pathsFile, content, 'utf8');
      this.log('Successfully updated paths.js', 'fix');
    } catch (error) {
      this.log(`Failed to write ${this.pathsFile}: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  fixDuplicates(content) {
    this.log('Checking for duplicate tool entries...');

    // Extract all tool paths from the file
    const toolPaths = content.match(/'[^']+\.js'/g) || [];

    if (toolPaths.length === 0) {
      this.log('No tool paths found in file', 'error');
      return content;
    }

    // Find duplicates
    const seen = new Set();
    const duplicates = [];
    const uniquePaths = [];

    toolPaths.forEach(path => {
      if (seen.has(path)) {
        duplicates.push(path);
      } else {
        seen.add(path);
        uniquePaths.push(path);
      }
    });

    if (duplicates.length === 0) {
      this.log('No duplicates found');
      return content;
    }

    this.log(`Found ${duplicates.length} duplicate(s): ${duplicates.join(', ')}`, 'fix');

    // Remove duplicates by rebuilding the array section
    const lines = content.split('\n');
    let inArray = false;
    let newLines = [];
    let indentLevel = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes('export const toolPaths = [')) {
        newLines.push(line);
        inArray = true;
        // Extract indentation from next line
        if (i + 1 < lines.length && lines[i + 1].trim().startsWith("'")) {
          const nextLine = lines[i + 1];
          indentLevel = nextLine.substring(0, nextLine.indexOf("'"));
        }

        // Add all unique paths
        uniquePaths.forEach((toolPath, index) => {
          const comma = index < uniquePaths.length - 1 ? ',' : '';
          newLines.push(`${indentLevel}${toolPath}${comma}`);
        });

        continue;
      }

      if (inArray) {
        if (line.includes('];')) {
          newLines.push(line);
          inArray = false;
        }
        // Skip original array content
        continue;
      }

      newLines.push(line);
    }

    this.changes.push(`Removed ${duplicates.length} duplicate tool entries`);
    return newLines.join('\n');
  }

  fixSyntaxIssues(content) {
    this.log('Checking for syntax issues...');

    let fixedContent = content;

    // Fix missing commas in array
    fixedContent = fixedContent.replace(
      /('supercommerce-api\/[^']+\.js')(\s*\n\s*)('supercommerce-api\/[^']+\.js')/g,
      '$1,$2$3'
    );

    // Fix trailing comma issues
    fixedContent = fixedContent.replace(/,(\s*\];)/g, '$1');

    // Ensure proper line endings
    fixedContent = fixedContent.replace(/\r\n/g, '\n');

    if (fixedContent !== content) {
      this.changes.push('Fixed syntax issues');
      this.log('Fixed syntax issues', 'fix');
    }

    return fixedContent;
  }

  async validateSyntax(content) {
    this.log('Validating syntax...');

    // Write to temporary file and try to import it
    const tempFile = './temp-paths-validation.js';

    try {
      fs.writeFileSync(tempFile, content);

      // Use dynamic import for ES modules
      const tempPath = path.resolve(tempFile);
      const module = await import(`file://${tempPath}?${Date.now()}`);
      const { toolPaths } = module;

      if (!Array.isArray(toolPaths)) {
        throw new Error('toolPaths is not an array');
      }

      fs.unlinkSync(tempFile);
      this.log('Syntax validation passed');
      return true;
    } catch (error) {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
      this.log(`Syntax validation failed: ${error.message}`, 'error');
      return false;
    }
  }

  async run() {
    this.log('Starting tool auto-fix...');

    let content = this.readPathsFile();

    // Apply fixes
    content = this.fixDuplicates(content);
    content = this.fixSyntaxIssues(content);

    // Validate the result
    if (!(await this.validateSyntax(content))) {
      this.log('Auto-fix failed - syntax issues remain', 'error');
      process.exit(1);
    }

    // Save the fixed content
    if (this.changes.length > 0) {
      this.writePathsFile(content);
      this.log(`Applied ${this.changes.length} fixes:`, 'fix');
      this.changes.forEach(change => this.log(`  - ${change}`, 'fix'));
    } else {
      this.log('No fixes needed - file is already valid');
    }

    this.log('Tool auto-fix completed successfully ✅');
  }
}

// Run the auto-fix if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const autoFix = new ToolAutoFix();
  await autoFix.run();
}

export default ToolAutoFix;