# 🔍 Tool Validation System

This document outlines the comprehensive tool validation system implemented to prevent tool registration errors and ensure MCP server stability.

## 🚨 Problem Solved

Previously, the system could suffer from:
- Duplicate tool registrations causing loading errors
- Syntax errors in `tools/paths.js` breaking the MCP server
- Invalid tool definitions causing runtime failures
- Broken builds being deployed to production

## 🛡️ Validation Layers

### 1. Pull Request Validation
**Workflow:** `.github/workflows/tool-validation.yml`
- **Triggers:** PRs that modify `tools/**`, `lib/tools.js`, or `package.json`
- **Checks:**
  - Duplicate tool path detection
  - `paths.js` syntax validation
  - Tool definition validation
  - Build testing
  - MCP server startup test
- **Result:** Adds validation status comment to PR

### 2. Postman Sync Validation
**Workflow:** `.github/workflows/postman-pr.yml`
- **Triggers:** Updates to `postman-updates` branch
- **Validation:** Pre-validates tools before creating PRs
- **Failure Handling:** Creates issue if validation fails
- **Safety:** Prevents broken Postman updates from reaching staging

### 3. Staging to Master Validation
**Workflow:** `.github/workflows/staging-to-master.yml`
- **Triggers:** Tool generation and promotion to master
- **Validation:** Full validation after tool generation
- **Auto-merge:** Only proceeds if validation passes
- **Failure Handling:** Creates production-blocking issue

### 4. Auto-Fix Validation
**Workflow:** `.github/workflows/claude-auto-fix.yml`
- **Triggers:** Auto-fix PRs from Claude
- **Validation:** Tests builds after Claude makes changes
- **Status:** Shows validation results in PR description
- **Labels:** Adds `build-failed` label if build fails

## 🔧 Validation Checks

### Duplicate Detection
```javascript
// Checks for duplicate tool registrations
const seen = new Set();
const duplicates = [];
paths.forEach(path => {
  if (seen.has(path)) duplicates.push(path);
  seen.add(path);
});
```

### Syntax Validation
```javascript
// Validates paths.js can be loaded
try {
  const { toolPaths } = require('./tools/paths.js');
  if (!Array.isArray(toolPaths)) throw new Error('toolPaths is not an array');
} catch (error) {
  // Handle syntax errors
}
```

### Definition Validation
```bash
# Runs the validateTools.js script
node validateTools.js
```

### Build Testing
```bash
# Ensures the application builds successfully
npm run build
```

### Runtime Testing
```bash
# Tests MCP server can start without errors
timeout 5s npm run start:stdio
```

## 📋 Labels Used

- `validation-failed` - Validation checks failed
- `build-failed` - Build test failed
- `production-blocked` - Issue is blocking production deployment
- `postman` - Related to Postman collection updates
- `auto-generated` - Automatically generated content
- `needs-review` - Requires human review

## 🚨 Error Handling

### When Validation Fails
1. **Workflow stops** - Prevents bad code from progressing
2. **Issue created** - Automatic issue creation with details
3. **Clear logging** - Specific error messages in workflow logs
4. **Action required** - Human intervention needed to fix

### Issue Auto-Creation
Issues are automatically created with:
- **Title:** Descriptive error title
- **Body:** Error details and resolution steps
- **Labels:** Appropriate labels for filtering
- **Links:** Direct links to failed workflow runs

## 🛠️ Manual Validation

### Local Testing
```bash
# Validate tools locally
node validateTools.js

# Test build
npm run build

# Test MCP server
npm run start:stdio

# Check for duplicates
node -e "
const fs = require('fs');
const pathsContent = fs.readFileSync('./tools/paths.js', 'utf8');
const paths = pathsContent.match(/'[^']+\.js'/g) || [];
const seen = new Set();
const duplicates = [];
paths.forEach(path => {
  if (seen.has(path)) duplicates.push(path);
  seen.add(path);
});
if (duplicates.length > 0) {
  console.log('DUPLICATES:', duplicates);
} else {
  console.log('No duplicates found');
}
"
```

### Fixing Common Issues

#### Duplicate Tools
1. Open `tools/paths.js`
2. Search for duplicate entries
3. Remove duplicates
4. Commit changes

#### Syntax Errors
1. Check `tools/paths.js` for:
   - Extra commas
   - Missing quotes
   - Invalid JavaScript syntax
2. Fix syntax errors
3. Test with `node -e "require('./tools/paths.js')"`

#### Invalid Tool Definitions
1. Run `node validateTools.js` for details
2. Fix tool definitions in individual files
3. Ensure proper export format:
   ```javascript
   const apiTool = {
     function: executeFunction,
     definition: { /* MCP definition */ }
   };
   export { apiTool };
   ```

## 📚 Best Practices

### For Postman Updates
- Always use the automated workflows
- Don't manually edit `tools/paths.js`
- Let the generation script handle tool registration
- Monitor validation status in PR comments

### For Manual Tool Creation
- Follow the standard tool structure
- Add to `tools/paths.js` correctly
- Test locally before committing
- Run `node validateTools.js` before push

### For Code Reviews
- Check validation status in PR comments
- Don't merge PRs with `build-failed` labels
- Review tool changes carefully
- Ensure MCP server functionality is maintained

## 🔄 Workflow Integration

All validation is integrated into existing workflows:
- **Zero additional steps** for developers
- **Automatic prevention** of broken deployments
- **Clear feedback** when issues occur
- **Actionable error messages** for quick resolution

## 📈 Monitoring

Monitor validation through:
- **GitHub Actions** - Workflow run history
- **Issues** - Auto-created validation failure issues
- **PR comments** - Validation status updates
- **Labels** - Filter PRs and issues by validation status

This system ensures that tool registration errors are caught early and prevent production deployment of broken code.