# 🤖 Automated Postman to MCP Tool Generation

This document describes the automated pipeline for generating MCP tools from Postman collection updates.

## Overview

The SuperCommerce MCP server now includes complete automation for synchronizing with Postman collections. Whenever the Postman collection is updated, new MCP tools are automatically generated, validated, and integrated into the codebase.

## 🔄 Automation Methods

### 1. GitHub Actions (Recommended)

**Trigger**: Automatically runs when Postman collection files are updated

**Workflow**: `.github/workflows/sync-postman-collection.yml`

**Features**:
- Monitors changes to `postman/collections/*.json`
- Generates new MCP tools automatically
- Creates pull requests for review
- Validates tool schemas
- Runs on schedule (daily) or manual trigger

**Setup**:
```bash
# The workflow is already configured
# It will run automatically when you push collection changes
```

### 2. Postman Webhooks

**Trigger**: Real-time updates when collection changes in Postman

**Endpoint**: `https://your-domain.com/api/webhook/postman`

**Setup in Postman**:
1. Go to your Postman workspace settings
2. Navigate to Webhooks
3. Create new webhook:
   - URL: `https://your-domain.com/api/webhook/postman`
   - Events: Collection updates
   - Add authentication if needed

**Environment Variables Required**:
```bash
POSTMAN_API_KEY=your-postman-api-key
POSTMAN_WEBHOOK_SECRET=optional-webhook-secret
```

### 3. Manual Generation

**Commands**:
- `npm run generate-tools` - Generate only NEW tools
- `npm run generate-tools:update` - Generate new AND update existing tools

**Usage**:
```bash
# Generate ONLY new tools (preserves existing tools)
npm run generate-tools

# Generate new tools AND update existing ones
npm run generate-tools:update

# Or use environment variable
UPDATE_EXISTING_TOOLS=true npm run generate-tools

# Validate all tools
npm run validate

# Test webhook handler locally
npm run webhook-test <collection-id>
```

**Update Behavior**:
- **Default**: Only creates new tools, skips existing ones
- **With --update flag**: Updates ALL tools from Postman
- **Backups**: Creates `.backup.js` files when updating

## 📁 Project Structure

```
supercommerce-mcp/
├── scripts/
│   ├── generate-tools-from-postman.js  # Core generation logic
│   └── postman-webhook-handler.js      # Webhook processing
├── .github/
│   └── workflows/
│       └── sync-postman-collection.yml # GitHub Actions workflow
├── pages/
│   └── api/
│       └── webhook/
│           └── postman.js              # Next.js webhook endpoint
├── postman/
│   └── collections/
│       └── *.json                      # Postman collections
└── tools/
    ├── supercommerce-api/              # Generated tool files
    └── paths.js                        # Tool registry
```

## 🔧 How It Works

### Tool Generation Process

1. **Collection Analysis**
   - Reads Postman collection JSON
   - Extracts all API endpoints
   - Identifies new/updated endpoints

2. **Tool Generation**
   - Converts Postman requests to MCP tools
   - Generates proper parameter schemas
   - Handles authentication and headers
   - Creates error handling logic

3. **File Management**
   - Creates new tool files in `tools/supercommerce-api/`
   - Updates `tools/paths.js` registry
   - Preserves existing customizations

4. **Validation**
   - Validates JSON schemas
   - Checks for conflicts
   - Ensures proper structure

5. **Integration**
   - For GitHub Actions: Creates pull request
   - For webhooks: Auto-commits and pushes
   - For manual: Local changes for review

## 📝 Generated Tool Structure

Each generated tool follows this pattern:

```javascript
/**
 * Function to [operation description].
 * @param {Object} params - The parameters
 * @returns {Promise<Object>} - The result
 */
const executeFunction = async (params) => {
  const baseURL = process.env.SUPERCOMMERCE_BASE_URL;
  const token = process.env.SUPERCOMMERCE_API_API_KEY;

  // API implementation
  // Error handling
  // Response processing
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'tool_name',
      description: 'Tool description',
      parameters: { /* JSON Schema */ }
    }
  }
};

export { apiTool };
```

## 🚀 Setting Up Automation

### Step 1: Configure Environment

Create `.env` file:
```env
SUPERCOMMERCE_BASE_URL=https://storeapi.el-dokan.com
SUPERCOMMERCE_API_API_KEY=your-jwt-token
POSTMAN_API_KEY=your-postman-api-key  # For webhook downloads
```

### Step 2: Enable GitHub Actions

The workflow is already configured and will run automatically when:
- Postman collection files are pushed
- Manually triggered via GitHub UI
- Daily at midnight UTC

### Step 3: Setup Postman Integration (Optional)

1. Get your Postman API key from account settings
2. Add webhook URL in Postman workspace
3. Configure webhook events for collection updates

### Step 4: Test the Pipeline

```bash
# Test tool generation locally
npm run generate-tools

# Validate generated tools
npm run validate

# Test webhook handler
npm run webhook-test
```

## 📊 Monitoring and Logs

### GitHub Actions
- View runs: Actions tab in GitHub repository
- Check logs: Click on workflow runs
- Review PRs: Pull requests tab

### Webhook Logs
- Server logs: Check Next.js console output
- Webhook history: Postman webhook dashboard
- Error tracking: Application logs

### Local Testing
```bash
# Generate tools with verbose output
node scripts/generate-tools-from-postman.js

# Test specific collection
node scripts/postman-webhook-handler.js <collection-id>
```

## 🔐 Security Considerations

1. **API Keys**
   - Store in environment variables
   - Never commit to repository
   - Use GitHub secrets for Actions

2. **Webhook Security**
   - Validate webhook signatures
   - Use HTTPS endpoints only
   - Implement rate limiting

3. **Generated Code**
   - Review generated tools before merging
   - Validate parameter types
   - Check for sensitive data exposure

## 🐛 Troubleshooting

### Common Issues

**Issue**: Tools not generating
```bash
# Check collection file exists
ls postman/collections/

# Run generation manually
npm run generate-tools

# Check for errors
node validateTools.js
```

**Issue**: GitHub Action failing
```yaml
# Check workflow syntax
# Verify permissions in repository settings
# Check GitHub secrets are configured
```

**Issue**: Webhook not triggering
```bash
# Test endpoint locally
curl -X POST http://localhost:3000/api/webhook/postman \
  -H "Content-Type: application/json" \
  -d '{"collection_id": "your-collection-id"}'
```

## 📚 Best Practices

1. **Review Generated Code**
   - Always review PRs from automation
   - Check parameter types and descriptions
   - Verify error handling

2. **Maintain Collection Quality**
   - Use descriptive names in Postman
   - Add parameter descriptions
   - Organize endpoints logically

3. **Version Control**
   - Tag releases after major updates
   - Document breaking changes
   - Keep collection and code in sync

4. **Testing**
   - Test generated tools locally first
   - Validate schemas regularly
   - Monitor error rates

## 🎯 Benefits

- **Automatic Sync**: No manual tool creation needed
- **Consistency**: All tools follow same pattern
- **Speed**: New APIs available immediately
- **Quality**: Automated validation and testing
- **Documentation**: Auto-generated from Postman
- **Version Control**: Full history of changes

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review GitHub Actions logs
3. Test manual generation locally
4. Open an issue in the repository

---

*This automation pipeline ensures that your MCP server stays perfectly synchronized with your Postman collection, providing a seamless development experience.*