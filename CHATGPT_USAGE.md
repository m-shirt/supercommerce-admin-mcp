# Using Widgets in ChatGPT

This guide shows how to use the Supercommerce widgets in ChatGPT via the MCP server.

## 🚀 Quick Start

### 1. Expose Your Local Server

Since the server runs on `localhost:3000`, you need to expose it to the internet:

```bash
# Install ngrok (one-time setup)
brew install ngrok  # macOS
# or download from https://ngrok.com/download

# Expose your local server
ngrok http 3000
```

You'll get a URL like: `https://abc123.ngrok.io`

### 2. Connect ChatGPT to MCP Server

1. Open ChatGPT (requires ChatGPT Plus or Pro)
2. Go to Settings → Beta Features
3. Enable "MCP Servers"
4. Add your server:
   - **Name:** Supercommerce
   - **URL:** `https://your-ngrok-url.ngrok.io/api/mcp`
   - **Type:** HTTP

### 3. Test the Connection

In ChatGPT, type:
```
What tools do you have access to?
```

ChatGPT should list all 130 Supercommerce API tools.

## 📱 Widget Prompts

### Product Grid Widget
**Trigger:** `get_product_list` tool
**Prompts:**
- "Show me all products"
- "List products in the catalog"
- "Get product list with keyword shoes"
- "Show products page 1"

**Result:** Interactive product grid with search, add to cart, and stock indicators

---

### Shopping Cart Widget
**Trigger:** Cart-related tools
**Prompts:**
- "Show my cart"
- "View shopping cart"
- "What's in my cart?"

**Result:** Cart with quantity controls, remove buttons, and order summary

---

### Checkout Form Widget
**Trigger:** Checkout-related tools
**Prompts:**
- "Proceed to checkout"
- "I want to place an order"
- "Create an order"

**Result:** Multi-step checkout form with customer/delivery/payment sections

---

### Order List Widget
**Trigger:** `list_orders` tool
**Prompts:**
- "Show all orders"
- "List my orders"
- "Get order list"
- "Show pending orders"

**Result:** Filterable order list with search and status badges

---

### Order Status Widget
**Trigger:** `view_order` tool
**Prompts:**
- "Track order ORD-12345"
- "Show order details for ORD-001"
- "View order status"

**Result:** Visual timeline showing order progression with full details

---

### Product Creation Widget
**Trigger:** Product creation tools
**Prompts:**
- "Create a new product"
- "Add a product to the catalog"
- "I want to create a product"

**Result:** Form with validation and live preview card

---

### Product Card Widget
**Trigger:** Product detail tools
**Prompts:**
- "Show details for product ID 123"
- "View product with SKU ABC-001"
- "Get product details"

**Result:** Detailed single product view with add to cart

---

## 🎨 Widget Features

All widgets include:

✅ **Responsive Design** - Works in pip, inline, and fullscreen modes
✅ **State Management** - Cart state persists across widgets
✅ **Real-time Updates** - Changes reflect immediately
✅ **Error Handling** - Graceful fallbacks for failed loads
✅ **Search & Filters** - Client-side filtering where applicable
✅ **Interactive Controls** - Buttons send messages back to ChatGPT

## 🔧 Troubleshooting

### Widget Not Showing?

1. **Check server is running:**
   ```bash
   # Visit in browser
   curl http://localhost:3000/api/mcp
   ```

2. **Verify ngrok is active:**
   ```bash
   # Should show forwarding status
   curl https://your-ngrok-url.ngrok.io/api/mcp
   ```

3. **Check widget resource:**
   - Visit http://localhost:3000/widgets
   - Select "product-grid" from the list
   - Verify it loads in preview

### "Failed to load widget" Error?

1. **Check browser console** for specific errors
2. **Verify build output exists:**
   ```bash
   ls -lh public/widgets/
   # Should show all 7 .js files
   ```

3. **Rebuild widgets if needed:**
   ```bash
   cd widgets && npm run build
   ```

### Widget Loads but No Data?

The widget receives data from `window.openai.toolInput`. Check:

1. **Tool response format** - Ensure tool returns expected structure
2. **Console logs** - Open browser devtools to see what data is passed
3. **Sample data** - Test in widget inspector first

## 🌐 Production Deployment

For permanent access without ngrok:

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Your widgets will be available at: `https://your-app.vercel.app`

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up
```

### Environment Variables

Required for all deployments:
```env
SUPERCOMMERCE_BASE_URL=https://storeapi.el-dokan.com
SUPERCOMMERCE_API_API_KEY=your_jwt_token_here
```

## 📊 Testing Locally

Use the built-in widget inspector:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open inspector:**
   ```
   http://localhost:3000/widgets
   ```

3. **Select a widget** from the list

4. **Edit sample data** to test different scenarios

5. **Check console** for state updates and messages

## 🎯 Example Conversation Flow

**User:** "Show me all products"
**ChatGPT:** *Calls `get_product_list` tool*
**Widget:** Product Grid renders with all products

**User:** *Clicks "Add to Cart" in widget*
**Widget:** Sends message "Added Product Name to cart ($99.99)"
**ChatGPT:** "I've added that to your cart. Would you like to continue shopping or checkout?"

**User:** "Show my cart"
**ChatGPT:** *Calls cart tool*
**Widget:** Shopping Cart renders with items

**User:** *Clicks "Proceed to Checkout" in widget*
**Widget:** Sends message "Proceed to checkout"
**ChatGPT:** *Calls checkout tool*
**Widget:** Checkout Form renders

## 📞 Support

- **Widget Inspector:** http://localhost:3000/widgets
- **API Docs:** Check `docs/` directory
- **MCP Spec:** https://modelcontextprotocol.io/
- **OpenAI Apps SDK:** https://developers.openai.com/apps-sdk

---

**Last Updated:** 2025-10-11
**Server:** Supercommerce MCP v3.0
**Widgets:** 7/7 Complete ✅
