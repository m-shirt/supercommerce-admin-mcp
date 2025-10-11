# ChatGPT Widget Examples & Test Scenarios

This guide provides ready-to-use prompts for testing Supercommerce widgets in ChatGPT, similar to the OpenAI Pizza examples.

## 🔗 Setup

1. **Expose your local server:**
   ```bash
   ngrok http 3000
   ```

2. **Get your ngrok URL** (e.g., `https://abc123.ngrok-free.app`)

3. **Add to ChatGPT:**
   - Settings → MCP Servers → Add Server
   - URL: `https://your-ngrok-url.ngrok-free.app/api/mcp`

## 📱 Our 7 Widgets vs Pizza Examples

### Comparison

| OpenAI Pizza Example | Supercommerce Widget | Purpose |
|---------------------|---------------------|---------|
| `pizza-map` | `product-grid` | Browse/search items |
| `pizza-carousel` | `shopping-cart` | View/manage selections |
| `pizza-albums` | `checkout-form` | Complete transaction |
| `pizza-list` | `order-list` | View all records |
| `pizza-video` | `order-status` | Track progress |
| _(n/a)_ | `product-creation` | Create new items |
| _(n/a)_ | `product-card` | View item details |

## ✅ Test Scenarios for Each Widget

### 1. Product Grid Widget 🛍️

**What it does:** Browse products with search, filters, and add to cart

**Tool triggered:** `get_product_list`

**Example Prompts:**
```
Show me all products
```
```
List products in the catalog
```
```
Get product list page 1
```
```
Show me products with keyword "laptop"
```
```
List all active products
```

**Expected Result:**
- Interactive grid of products with images
- Search bar for filtering by name/SKU
- Stock status badges (In Stock/Low/Out of Stock)
- Add to cart buttons
- Cart badge showing item count

**User Interactions:**
- Type in search: "laptop"
- Click "Add to Cart" on any product
- Click cart badge to view cart

---

### 2. Shopping Cart Widget 🛒

**What it does:** View and manage cart items with totals

**Tool triggered:** Cart-related tools (needs implementation)

**Example Prompts:**
```
Show my shopping cart
```
```
View my cart
```
```
What's in my cart?
```

**Expected Result:**
- List of cart items with images
- Quantity controls (+/- buttons)
- Remove item buttons
- Subtotal, tax, shipping calculations
- Total amount
- "Proceed to Checkout" button
- "Continue Shopping" button

**User Interactions:**
- Click + to increase quantity
- Click - to decrease quantity
- Click "Remove" to remove item
- Click "Proceed to Checkout"

---

### 3. Checkout Form Widget 💳

**What it does:** Complete order with customer/delivery/payment info

**Tool triggered:** Checkout-related tools

**Example Prompts:**
```
Proceed to checkout
```
```
I want to place an order
```
```
Create a new order
```
```
Checkout with my cart
```

**Expected Result:**
- Multi-section form:
  - Customer Information (dropdown)
  - Delivery Address (street, city, phone)
  - Payment Method (dropdown)
  - Order Notes (optional textarea)
- Order summary sidebar with:
  - Cart items list
  - Subtotal, tax, shipping, total
  - "Place Order" button
- Form validation with error messages
- Responsive 2-column layout

**User Interactions:**
- Select customer from dropdown
- Fill in delivery address
- Select city
- Enter phone number
- Select payment method
- Click "Place Order $XXX.XX"

---

### 4. Order List Widget 📦

**What it does:** View and filter all orders

**Tool triggered:** `list_orders`

**Example Prompts:**
```
Show all orders
```
```
List my orders
```
```
Get order list
```
```
Show pending orders
```
```
View orders from today
```

**Expected Result:**
- Search bar for filtering by ID or customer
- Status filter buttons:
  - All Orders (count badge)
  - Pending (count badge)
  - Processing (count badge)
  - Shipped (count badge)
  - Delivered (count badge)
  - Cancelled (count badge)
- Grid of order cards showing:
  - Order ID
  - Customer name
  - Number of items
  - Order date
  - Total amount
  - Status badge (color-coded)
  - "View Details" button

**User Interactions:**
- Type in search: "ORD-001"
- Click status filter: "Pending"
- Click on any order card to view details

---

### 5. Order Status Widget 📊

**What it does:** Track order with visual timeline

**Tool triggered:** `view_order`

**Example Prompts:**
```
Track order ORD-001
```
```
Show order details for ORD-12345
```
```
View order status
```
```
Check status of my order
```

**Expected Result:**
- Visual timeline showing:
  - ✅ Pending → Processing → Shipped → Delivered
  - Active stage highlighted
  - Completed stages with checkmarks
- Order Information card:
  - Order ID and date
  - Status badge
  - Tracking number (if available)
- Customer Information:
  - Name, email, phone
- Delivery Address:
  - Street address, city, country
- Payment Method:
  - Method name, last 4 digits (if card)
- Order Items:
  - Product images, names, quantities, prices
- Order Summary:
  - Subtotal, tax, shipping, total
- "Update Status" button

**User Interactions:**
- Click "Update Status" to advance order
- View timeline progression

---

### 6. Product Creation Widget ➕

**What it does:** Create new products with validation

**Tool triggered:** Product creation tools

**Example Prompts:**
```
Create a new product
```
```
Add a product to the catalog
```
```
I want to add a new product
```
```
Create product
```

**Expected Result:**
- Two-column layout:
  - **Left:** Creation form with fields:
    - Product Name (required)
    - SKU (required, format validation)
    - Price (required, min $0.01)
    - Stock (required, min 0)
    - Category (dropdown)
    - Brand (dropdown)
    - Description (textarea)
    - Image URL
  - **Right:** Live preview card showing:
    - Product image
    - Product name
    - SKU badge
    - Category/brand badges
    - Price
    - Stock indicator
    - Description preview
- Real-time validation with error messages
- "Create Product" button
- Form resets after successful creation

**User Interactions:**
- Fill in product details
- Watch preview update in real-time
- Fix validation errors
- Click "Create Product"

---

### 7. Product Card Widget 🏷️

**What it does:** View detailed single product with purchase options

**Tool triggered:** Product detail tools

**Example Prompts:**
```
Show product details for ID 123
```
```
View product SKU-001
```
```
Get details for product 5
```
```
Show me product information
```

**Expected Result:**
- Large product image
- Product information:
  - Product name (prominent)
  - SKU badge
  - Category badge (purple)
  - Brand badge (blue)
  - Stock status badge (color-coded)
  - Full description
  - Price (large, prominent)
- Quantity selector:
  - - button
  - Current quantity
  - + button
  - Total price calculation
- "Add to Cart" button (disabled if out of stock)
- Cart indicator showing:
  - Total items in cart
  - Cart total amount
- Navigation buttons:
  - "View All Products"
  - "Continue Shopping"

**User Interactions:**
- Click +/- to adjust quantity
- Click "Add to Cart"
- View cart indicator update
- Click "Continue Shopping"

---

## 🎯 Complete Example Conversation

Here's a full conversation flow using multiple widgets:

### Step 1: Browse Products
**You:** "Show me all products"
**ChatGPT:** *Renders Product Grid*
**Widget:** Displays 10 products with search bar

### Step 2: Search & Add to Cart
**You:** *Type "laptop" in search box*
**Widget:** Filters to show laptop products
**You:** *Click "Add to Cart" on a laptop*
**Widget:** Shows "Added Dell Laptop to cart ($999.99)"

### Step 3: View Cart
**You:** "Show my cart"
**ChatGPT:** *Renders Shopping Cart*
**Widget:** Shows 1 item, total $1,049.99 (with tax/shipping)
**You:** *Click + button twice to increase quantity to 3*
**Widget:** Updates total to $3,049.99

### Step 4: Checkout
**You:** *Click "Proceed to Checkout" button*
**Widget:** Sends message "Proceed to checkout"
**ChatGPT:** *Renders Checkout Form*
**Widget:** Shows form with order summary sidebar

### Step 5: Complete Order
**You:** *Fill in customer info, address, payment*
**You:** *Click "Place Order $3,049.99"*
**Widget:** Sends order data to ChatGPT
**ChatGPT:** "Order placed successfully! Your order ID is ORD-12345"

### Step 6: Track Order
**You:** "Track order ORD-12345"
**ChatGPT:** *Renders Order Status*
**Widget:** Shows timeline with order in "Processing" stage

---

## 🔍 Testing Checklist

Use this checklist to verify each widget works correctly:

- [ ] **Product Grid**
  - [ ] Products display in grid
  - [ ] Search filters products
  - [ ] Add to cart works
  - [ ] Cart badge shows count
  - [ ] Stock badges display correctly

- [ ] **Shopping Cart**
  - [ ] Items display with images
  - [ ] Quantity +/- works
  - [ ] Remove item works
  - [ ] Totals calculate correctly
  - [ ] Buttons send messages

- [ ] **Checkout Form**
  - [ ] All form fields render
  - [ ] Validation works
  - [ ] Order summary updates
  - [ ] Place order sends data

- [ ] **Order List**
  - [ ] Orders display in grid
  - [ ] Search filters correctly
  - [ ] Status filters work
  - [ ] Click opens details

- [ ] **Order Status**
  - [ ] Timeline displays
  - [ ] Order details show
  - [ ] Update status works

- [ ] **Product Creation**
  - [ ] Form validates input
  - [ ] Preview updates live
  - [ ] Create sends data
  - [ ] Form resets after

- [ ] **Product Card**
  - [ ] Product details show
  - [ ] Quantity selector works
  - [ ] Add to cart works
  - [ ] Navigation works

---

## 🐛 Troubleshooting

### Widget doesn't render?

1. **Check ngrok is running:**
   ```bash
   curl https://your-ngrok-url.ngrok-free.app/api/mcp
   ```

2. **Verify tool has _meta fields:**
   ```javascript
   _meta: {
     'openai/outputTemplate': 'ui://widget/product-grid.html',
     'openai/toolInvocation/invoking': '🔍 Loading products...',
     'openai/toolInvocation/invoked': '✅ Products loaded'
   }
   ```

3. **Check resource exists:**
   - Visit: http://localhost:3000/widgets
   - Select widget from list
   - Verify HTML loads

### Widget loads but no data?

**Check tool response includes data:**
```javascript
{
  content: [{
    type: "text",
    text: "Products loaded"
  }],
  structuredContent: {
    products: [...] // Your data here
  },
  _meta: widgetMeta()
}
```

### Widget crashes?

**Check browser console:**
1. Right-click widget → Inspect
2. Check Console tab for errors
3. Common issues:
   - Missing React imports
   - Data format mismatch
   - CSS conflicts

---

## 📚 Additional Resources

- **Local Testing:** http://localhost:3000/widgets
- **Full Documentation:** [CHATGPT_USAGE.md](./CHATGPT_USAGE.md)
- **Implementation Guide:** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- **Widget Docs:** [docs/widgets/README.md](./docs/widgets/README.md)

---

**Last Updated:** 2025-10-11
**Status:** All 7 widgets ready for testing ✅
