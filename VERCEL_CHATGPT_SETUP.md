# Vercel Deployment & ChatGPT Setup Guide

## ✅ Deployment Status

Your code has been pushed to GitHub and Vercel is now deploying automatically!

## Step 1: Get Your Vercel Deployment URL

1. **Check your Vercel dashboard:**
   - Go to https://vercel.com/dashboard
   - Find your `supercommerce-admin-mcp` project
   - Wait for the deployment to complete (usually 2-3 minutes)
   - Copy the production URL (e.g., `https://supercommerce-admin-mcp.vercel.app`)

2. **Your MCP endpoint will be:**
   ```
   https://YOUR-PROJECT.vercel.app/api/mcp
   ```

## Step 2: Configure Environment Variables on Vercel

**IMPORTANT:** Make sure these environment variables are set in Vercel:

1. Go to your project in Vercel
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
SUPERCOMMERCE_BASE_URL=https://storeapi.el-dokan.com
SUPERCOMMERCE_API_API_KEY=your_jwt_bearer_token_here
```

4. **Redeploy** if you just added these variables

## Step 3: Deploy Widget Assets to Vercel

The widget assets need to be publicly accessible. You have two options:

### Option A: Serve from Vercel (Recommended)

Your widgets are already in the `assets/` directory and will be served automatically at:
```
https://YOUR-PROJECT.vercel.app/assets/
```

Update the widget URLs in `build-widgets.mts`:

```typescript
// Line ~58-60
if (cssFile) {
  html += `<link rel="stylesheet" href="https://YOUR-PROJECT.vercel.app/assets/${cssFile.fileName}">\n`;
}
html += `<script type="module" src="https://YOUR-PROJECT.vercel.app/assets/${jsFile.fileName}"></script>`;
```

Then rebuild and commit:
```bash
npm run build:widgets
git add assets/ build-widgets.mts
git commit -m "chore: update widget URLs for Vercel deployment"
git push
```

### Option B: Use a CDN (CloudFlare, AWS S3, etc.)

Upload the `assets/` directory to your CDN and update the URLs accordingly.

## Step 4: Connect to ChatGPT

### Enable Developer Mode

1. Go to https://platform.openai.com/docs/guides/developer-mode
2. Follow instructions to enable developer mode for your OpenAI account

### Add Your MCP Server to ChatGPT

1. **Open ChatGPT** (web interface)
2. **Click Settings** (bottom left)
3. **Navigate to "Connectors"** section
4. **Click "Add Connector"**
5. **Enter your endpoint URL:**
   ```
   https://YOUR-PROJECT.vercel.app/api/mcp
   ```
6. **Click "Connect"**

ChatGPT will automatically:
- Discover all 130 e-commerce tools
- Register the widget resources
- Enable the prompt library

## Step 5: Test Your Integration

### Test Commands in ChatGPT

**Product Management:**
```
"Create a new product called Wireless Keyboard with SKU KB-001"
```

**Order Management:**
```
"Show me recent orders from today"
```

**Inventory:**
```
"List all available inventories"
```

**Customer Management:**
```
"Show me all active customers"
```

**Widget Display:**

When you use tools with widgets (like create_main_product or list_orders), you'll see beautiful interactive UI components instead of just JSON!

## Troubleshooting

### "Connection Failed" Error

1. **Check deployment status:**
   ```bash
   curl https://YOUR-PROJECT.vercel.app/api/mcp
   ```
   You should see "Cannot GET /api/mcp" (this is correct!)

2. **Verify environment variables are set** in Vercel dashboard

3. **Check deployment logs** in Vercel for any errors

4. **Test the endpoint:**
   ```bash
   curl -X POST https://YOUR-PROJECT.vercel.app/api/mcp \
     -H "Content-Type: application/json" \
     -H "Accept: application/json, text/event-stream" \
     -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
   ```

### Tools Not Appearing

1. **Disconnect and reconnect** the connector in ChatGPT
2. **Clear ChatGPT cache** (refresh the page)
3. **Check deployment logs** for errors

### Widgets Not Rendering

1. **Verify widget assets are accessible:**
   ```bash
   curl https://YOUR-PROJECT.vercel.app/assets/widget-registry.json
   ```

2. **Check browser console** in ChatGPT for JavaScript errors

3. **Ensure CORS headers are correct** (Next.js should handle this automatically)

## Production Checklist

- [ ] Vercel deployment successful
- [ ] Environment variables configured
- [ ] Widget assets accessible at /assets/
- [ ] MCP endpoint responds to POST requests
- [ ] ChatGPT connector added and connected
- [ ] Test basic tool calls
- [ ] Test widget rendering
- [ ] Monitor error logs

## Next Steps

1. **Add More Widgets**
   - Create widgets for frequently-used tools
   - Enhance existing widgets with more features

2. **Customize Styling**
   - Update widget CSS to match your brand
   - Add animations and transitions

3. **Monitor Usage**
   - Check Vercel analytics
   - Review ChatGPT usage patterns
   - Optimize frequently-used tools

4. **Production Hardening**
   - Add rate limiting if needed
   - Implement authentication/authorization
   - Set up error monitoring (Sentry, LogRocket, etc.)

## Quick Reference

**Vercel Dashboard:** https://vercel.com/dashboard
**GitHub Repo:** https://github.com/m-shirt/supercommerce-admin-mcp
**OpenAI Developer Mode:** https://platform.openai.com/docs/guides/developer-mode

**Your Endpoints:**
- Production: `https://YOUR-PROJECT.vercel.app/api/mcp`
- Widget Assets: `https://YOUR-PROJECT.vercel.app/assets/`
- Widget Registry: `https://YOUR-PROJECT.vercel.app/assets/widget-registry.json`

**Available Tools:** 130 e-commerce API tools
**Available Widgets:** 2 (product-creation, order-list)
**Available Prompts:** Product creation workflow

---

**Last Updated:** 2025-10-10
**Deployment:** Automatic via Vercel
