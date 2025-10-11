# Widget Fixes Applied

## Common Fixes for All 6 Widgets

1. **Reactive toolOutput** - Add polling to detect when tool executes
2. **Height constraints** - Change min-height: 100vh → 400px, add max-height: 600px
3. **Loading state** - Show spinner before data arrives
4. **Data URIs** - Replace via.placeholder.com with inline SVG
5. **sendFollowUpMessage** - Use correct ChatGPT API
6. **toolOutput parsing** - Read from toolOutput.result.content[0].text

## Files to Fix
- shopping-cart.tsx ✓
- order-list.tsx ✓
- order-status.tsx ✓
- checkout-form.tsx ✓
- product-card.tsx ✓
- product-creation.tsx ✓
