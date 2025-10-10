# 🚀 Active Deployment - Supercommerce MCP for ChatGPT

## Your ChatGPT MCP Endpoint

```
https://31392791046a.ngrok-free.app/mcp
```

## Current Status

✅ **MCP Server Running** - Port 3001 with widget support
✅ **ngrok Tunnel Active** - Public URL established
✅ **Widget Resources** - 2 widgets ready (product-creation, order-list)
✅ **API Tools** - 130 e-commerce tools available
✅ **All Capabilities** - Tools, prompts, and resources fully operational

## How to Connect to ChatGPT

### Step 1: Enable Developer Mode

1. Go to [ChatGPT Developer Mode](https://platform.openai.com/docs/guides/developer-mode)
2. Follow the instructions to enable developer mode for your account

### Step 2: Add Your MCP Server

1. Open **ChatGPT Settings**
2. Navigate to **Connectors** section
3. Click **Add Connector**
4. Enter the endpoint URL:
   ```
   https://31392791046a.ngrok-free.app/mcp
   ```
5. Click **Connect**

### Step 3: Test the Integration

Try these example commands in ChatGPT:

**Product Creation (with widget):**
```
Create a new product called "Wireless Gaming Mouse"
with SKU "MOUSE-001" in the Electronics category
```

**Order List (with widget):**
```
Show me the recent orders from the past week
```

**Inventory Check:**
```
List all available inventories
```

**Customer Management:**
```
Show me all active customers
```

## Widget Display

When you use tools that have widgets attached, you'll see:

### Product Creation Widget
- Beautiful status card showing creation progress
- Product details display (name, SKU, price, inventory)
- Status indicators (success/error/pending)
- Interactive "View Product Details" button

### Order List Widget
- Clean, modern order list with thumbnails
- Status badges (delivered, shipped, pending)
- Order details (customer, date, total, items)
- Hover effects and responsive design

## Important Notes

### ngrok Session
- **This URL is temporary** and will change if ngrok restarts
- Free ngrok accounts have session limits
- For production, deploy to a permanent server (see CHATGPT_DEPLOYMENT.md)

### Widget Assets
- Widgets are currently using placeholder CDN URLs: `https://your-cdn.com/assets/`
- For full functionality, deploy widget assets to a real CDN
- Update `build-widgets.mts` with your CDN URL and rebuild

## Keeping the Server Running

### Current Session
Your server is running in the background. To check status:

```bash
# Check MCP server
lsof -i:3001

# Check ngrok tunnel
curl http://localhost:4040/api/tunnels
```

### Stop Services
```bash
# Stop MCP server
lsof -ti:3001 | xargs kill

# Stop ngrok
pkill ngrok
```

### Restart Services
```bash
# Start MCP server
npm run start:http &

# Start ngrok
ngrok http 3001
```

## Troubleshooting

### "Connection Failed" in ChatGPT

1. **Verify server is running:**
   ```bash
   curl -X POST https://31392791046a.ngrok-free.app/mcp \
     -H "Accept: application/json, text/event-stream" \
     -H "Content-Type: application/json"
   ```

2. **Check ngrok status:**
   ```bash
   curl http://localhost:4040/api/tunnels
   ```

3. **Restart if needed:**
   ```bash
   # Kill old processes
   lsof -ti:3001 | xargs kill
   pkill ngrok

   # Restart
   npm run start:http &
   ngrok http 3001
   ```

### Tools Not Showing in ChatGPT

1. **Disconnect and reconnect** the connector in ChatGPT settings
2. **Verify tools are loading:**
   ```bash
   npm run list-tools
   ```

### Widgets Not Rendering

Currently, widgets have placeholder URLs and won't fully render until:
1. Widget assets are deployed to a public CDN
2. `build-widgets.mts` is updated with the CDN URL
3. Widgets are rebuilt with `npm run build:widgets`

**Quick fix for testing:** Deploy assets to ngrok:
```bash
# Terminal 1: Serve widget assets
npm run serve:widgets

# Terminal 2: Expose with ngrok
ngrok http 4444

# Update build-widgets.mts with the ngrok URL
# Then rebuild: npm run build:widgets
```

## Production Deployment

For a permanent deployment:

1. **Deploy to a cloud provider** (Vercel, AWS, Google Cloud, etc.)
2. **Set up environment variables:**
   - `SUPERCOMMERCE_BASE_URL`
   - `SUPERCOMMERCE_API_API_KEY`
   - `PORT`
3. **Deploy widget assets to CDN** (Cloudflare, AWS S3, etc.)
4. **Update widget URLs** in build-widgets.mts
5. **Rebuild widgets** with production URLs
6. **Use permanent MCP URL** in ChatGPT settings

See `CHATGPT_DEPLOYMENT.md` for full production deployment guide.

## API Coverage

Your MCP server exposes **130 tools** across these categories:

- ✅ Product Management (create, update, delete)
- ✅ Order Management (list, view, edit, create)
- ✅ Customer Management (create, list, activate/deactivate)
- ✅ Inventory Management
- ✅ Geographic Data (governorates, areas, cities)
- ✅ Prescriptions
- ✅ Marketing & Promotions
- ✅ Push Notifications
- ✅ Content Management (pages, static content)
- ✅ Financial Operations (transactions)
- ✅ Delivery Management
- ✅ Administrative Tools

## Next Steps

1. ✅ Connect to ChatGPT using the URL above
2. ✅ Test basic tool calls
3. ⏳ Deploy widget assets to CDN for full widget functionality
4. ⏳ Add more widgets for commonly-used tools
5. ⏳ Deploy to production server for permanent URL
6. ⏳ Submit to OpenAI Apps Directory (when available)

---

**Last Updated:** 2025-10-10
**ngrok URL Valid Until:** Session end or restart
