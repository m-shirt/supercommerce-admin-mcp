# Deploying Supercommerce MCP to ChatGPT

This guide explains how to deploy your Supercommerce MCP server as a ChatGPT app using the OpenAI Apps SDK.

## Prerequisites

- Node.js 18+ installed
- ngrok account (for local testing) or a public server URL
- OpenAI account with ChatGPT access
- ChatGPT developer mode enabled

## Architecture Overview

Your Supercommerce MCP server now supports:
- **130 e-commerce API tools** for products, orders, customers, etc.
- **Interactive widgets** for rich UI experiences in ChatGPT
- **Model Context Protocol (MCP)** for standardized communication
- **Multiple transport modes**: STDIO, HTTP, SSE

## Step 1: Build the Widgets

Build the UI components that will render in ChatGPT:

```bash
npm run build:widgets
```

This generates optimized widget bundles in the `assets/` directory and creates a widget registry at `assets/widget-registry.json`.

**Built widgets:**
- `product-creation` - Beautiful product creation result display
- `order-list` - Interactive order list with status badges

## Step 2: Start the MCP Server

Start the MCP server with HTTP transport (required for ChatGPT):

```bash
npm run start:http
```

The server will start on `http://localhost:3001` with the endpoint at `/mcp`.

**Server capabilities:**
- ✅ 130 API tools
- ✅ Widget resources
- ✅ Prompts
- ✅ MCP protocol support

## Step 3: Expose Your Server to the Internet

### Option A: Using ngrok (Recommended for Testing)

1. **Install ngrok:**
   ```bash
   brew install ngrok
   # or download from https://ngrok.com
   ```

2. **Create ngrok account and authenticate:**
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

3. **Start ngrok tunnel:**
   ```bash
   ngrok http 3001
   ```

4. **Copy the public URL** (e.g., `https://abc123.ngrok-free.app`)

Your MCP endpoint will be: `https://abc123.ngrok-free.app/mcp`

### Option B: Deploy to Production Server

Deploy your MCP server to a cloud provider:

**Recommended platforms:**
- **Vercel/Netlify** - Easy deployment for Node.js
- **AWS Lambda** - Serverless deployment
- **Google Cloud Run** - Container-based deployment
- **Heroku** - Simple platform deployment

**Environment variables required:**
```bash
SUPERCOMMERCE_BASE_URL=https://storeapi.el-dokan.com
SUPERCOMMERCE_API_API_KEY=your_jwt_token_here
PORT=3001
```

## Step 4: Serve Widget Assets (Required for Production)

Widgets need to be served from a public URL. You have two options:

### Option A: Use the Local Asset Server (Development Only)

```bash
npm run serve:widgets
```

This serves widgets at `http://localhost:4444` with CORS enabled.

With ngrok:
```bash
ngrok http 4444
```

Update `build-widgets.mts` with your ngrok URL.

### Option B: Deploy to CDN (Production Recommended)

Upload the `assets/` directory to a CDN:

1. **Upload to CDN:**
   ```bash
   # Example: AWS S3 + CloudFront
   aws s3 sync ./assets s3://your-bucket/supercommerce-widgets/
   ```

2. **Update widget registry:**

   Edit `build-widgets.mts` line 58-60:
   ```typescript
   if (cssFile) {
     html += `<link rel="stylesheet" href="https://your-cdn.com/${cssFile.fileName}">\n`;
   }
   html += `<script type="module" src="https://your-cdn.com/${jsFile.fileName}"></script>`;
   ```

3. **Rebuild widgets:**
   ```bash
   npm run build:widgets
   ```

## Step 5: Connect to ChatGPT

1. **Enable Developer Mode:**
   - Go to https://platform.openai.com/docs/guides/developer-mode
   - Enable developer mode for your account

2. **Add Your MCP Server:**
   - Open ChatGPT Settings
   - Navigate to **Connectors** section
   - Click **Add Connector**
   - Enter your MCP endpoint URL

   **Examples:**
   - ngrok: `https://abc123.ngrok-free.app/mcp`
   - Production: `https://your-domain.com/mcp`

3. **Test the Connection:**
   - ChatGPT will discover all 130 tools
   - Widgets will be registered as resources
   - Test with: "List my recent orders" or "Create a new product"

## Step 6: Test Widget Integration

Try these commands in ChatGPT to see the widgets in action:

**Product Creation Widget:**
```
Create a new product called "Wireless Mouse"
with SKU "MOUSE-001" in the Electronics category
```

**Order List Widget:**
```
Show me the recent orders from today
```

The widgets will render inline with beautiful, interactive UI components showing:
- Product creation status
- Order lists with status badges
- Real-time data from your Supercommerce API

## Widget Customization

### Adding New Widgets

1. **Create widget component:**
   ```bash
   mkdir src/widgets/your-widget
   touch src/widgets/your-widget/index.jsx
   ```

2. **Build widget:**
   ```jsx
   import React from "react";
   import { createRoot } from "react-dom/client";
   import "../shared/index.css";

   function YourWidget() {
     const data = window.__WIDGET_DATA__ || {};
     return <div>Your widget content</div>;
   }

   createRoot(document.getElementById("your-widget-root")).render(<YourWidget />);
   ```

3. **Add to a tool:**

   In `tools/supercommerce-api/your-tool.js`:
   ```javascript
   const apiTool = {
     function: executeFunction,
     definition: {
       type: 'function',
       function: {
         name: 'your_tool',
         description: 'Your tool description',
         _meta: {
           'openai/outputTemplate': 'ui://widget/your-widget.html',
           'openai/toolInvocation/invoking': 'Processing...',
           'openai/toolInvocation/invoked': 'Done!',
           'openai/widgetAccessible': true,
           'openai/resultCanProduceWidget': true
         },
         parameters: { /* ... */ }
       }
     }
   };
   ```

4. **Rebuild:**
   ```bash
   npm run build:widgets
   ```

## Troubleshooting

### Widgets Not Displaying

1. **Check widget assets are accessible:**
   ```bash
   curl https://your-cdn.com/assets/widget-registry.json
   ```

2. **Verify CORS headers:**
   Widgets must be served with CORS enabled.

3. **Check browser console:**
   Open ChatGPT in browser, check for JavaScript errors.

### MCP Server Not Connecting

1. **Test server endpoint:**
   ```bash
   curl -X POST http://localhost:3001/mcp \
     -H "Accept: application/json, text/event-stream" \
     -H "Content-Type: application/json"
   ```

2. **Check environment variables:**
   ```bash
   echo $SUPERCOMMERCE_BASE_URL
   echo $SUPERCOMMERCE_API_API_KEY
   ```

3. **View server logs:**
   Server logs will show MCP protocol messages.

### Tools Not Appearing

1. **Validate tools:**
   ```bash
   npm run validate
   ```

2. **List available tools:**
   ```bash
   npm run list-tools
   ```

## Production Deployment Checklist

- [ ] Environment variables configured
- [ ] Widget assets deployed to CDN
- [ ] Widget registry updated with CDN URLs
- [ ] Widgets rebuilt after CDN update
- [ ] MCP server deployed to production
- [ ] HTTPS enabled on MCP endpoint
- [ ] CORS configured correctly
- [ ] Server health monitoring enabled
- [ ] Error logging configured
- [ ] Rate limiting configured (if needed)
- [ ] Authentication/authorization added (if needed)

## Next Steps

1. **Add more widgets** for key workflows
2. **Customize widget styles** to match your brand
3. **Add authentication** for secure API access
4. **Monitor usage** and performance
5. **Submit to OpenAI Apps Directory** (when available)

## Resources

- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk/)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- [OpenAI Apps SDK Examples](https://github.com/openai/openai-apps-sdk-examples)
- [Supercommerce API Documentation](https://storeapi.el-dokan.com)

## Support

For issues or questions:
- Check `CLAUDE.md` for project-specific guidance
- Review tool validation with `npm run validate`
- Test locally before deploying to production
