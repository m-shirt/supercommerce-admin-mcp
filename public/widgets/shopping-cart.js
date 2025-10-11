import I from"react-dom/client";import{useEffect as q,useState as C}from"react";function p(){let[m,i]=C(null);return q(()=>{typeof window<"u"&&window.openai&&i(window.openai)},[]),m}import{useState as T,useEffect as z}from"react";function w(m){let i=p(),[u,o]=T(m);return z(()=>{if(i?.widgetState){let r=i.widgetState.get();r&&Object.keys(r).length>0&&o({...m,...r})}},[i]),[u,r=>{o(c=>{let y=typeof r=="function"?r(c):r,g={...c,...y};return i?.widgetState&&i.widgetState.set(g),g})}]}import{jsx as e,jsxs as a}from"react/jsx-runtime";function R(){let i=window.openai?.toolInput||{},u=i?.items||i?.cart?.items||[],[o,b]=w({cart:{items:u,total:u.reduce((t,s)=>t+s.price*s.quantity,0)}}),r=p("displayMode"),c=(t,s)=>{if(s<1)return;let d=o.cart.items.map(n=>n.id===t?{...n,quantity:s}:n),h=d.reduce((n,l)=>n+l.price*l.quantity,0);b({cart:{items:d,total:h}})},y=t=>{let s=o.cart.items.find(n=>n.id===t),d=o.cart.items.filter(n=>n.id!==t),h=d.reduce((n,l)=>n+l.price*l.quantity,0);b({cart:{items:d,total:h}}),s&&window.openai?.sendMessage(`Removed ${s.name} from cart`)},g=()=>{window.openai?.sendMessage("Proceed to checkout")},v=()=>{window.openai?.sendMessage("Show products")},f=o.cart.total,x=f*.1,N=f>0?15:0,S=f+x+N;return a("div",{className:`shopping-cart-container ${r}`,children:[e("style",{children:`
        .shopping-cart-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .cart-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .item-count {
          color: white;
          font-size: 1rem;
          opacity: 0.9;
        }

        .cart-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .shopping-cart-container:not(.pip) .cart-content {
          grid-template-columns: 2fr 1fr;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-item {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .item-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
          background: #f3f4f6;
        }

        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .item-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .item-sku {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .item-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #667eea;
        }

        .item-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: auto;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 0.25rem;
        }

        .qty-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: white;
          border-radius: 6px;
          font-size: 1.25rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .qty-btn:hover {
          background: #e5e7eb;
        }

        .qty-value {
          min-width: 40px;
          text-align: center;
          font-weight: 600;
          color: #1f2937;
        }

        .remove-btn {
          padding: 0.5rem 1rem;
          background: #fee2e2;
          color: #991b1b;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .remove-btn:hover {
          background: #fecaca;
        }

        .item-subtotal {
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .subtotal-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .cart-summary {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          height: fit-content;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 1rem;
        }

        .summary-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .summary-row:last-of-type {
          border-bottom: none;
          padding-top: 1rem;
          margin-top: 0.5rem;
          border-top: 2px solid #e5e7eb;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .summary-label {
          color: #6b7280;
        }

        .summary-value {
          font-weight: 600;
          color: #1f2937;
        }

        .summary-row:last-of-type .summary-label,
        .summary-row:last-of-type .summary-value {
          color: #667eea;
        }

        .checkout-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
          transition: opacity 0.2s;
        }

        .checkout-btn:hover {
          opacity: 0.9;
        }

        .continue-shopping {
          width: 100%;
          padding: 1rem;
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.75rem;
          transition: all 0.2s;
        }

        .continue-shopping:hover {
          background: #f3f4f6;
        }

        .empty-cart {
          background: white;
          border-radius: 12px;
          padding: 4rem 2rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-cart h2 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .empty-cart p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .shopping-cart-container:not(.pip) .cart-content {
            grid-template-columns: 1fr;
          }

          .cart-item {
            flex-direction: column;
          }

          .item-image {
            width: 100%;
            height: 150px;
          }

          .item-subtotal {
            flex-direction: row;
            align-items: center;
          }
        }
      `}),a("div",{className:"cart-header",children:[e("h1",{className:"cart-title",children:"Shopping Cart"}),a("span",{className:"item-count",children:[o.cart.items.length," ",o.cart.items.length===1?"item":"items"]})]}),o.cart.items.length===0?a("div",{className:"empty-cart",children:[e("div",{className:"empty-icon",children:"\u{1F6D2}"}),e("h2",{children:"Your cart is empty"}),e("p",{children:"Add some products to get started"}),e("button",{className:"checkout-btn",onClick:v,children:"Browse Products"})]}):a("div",{className:"cart-content",children:[e("div",{className:"cart-items",children:o.cart.items.map(t=>a("div",{className:"cart-item",children:[e("img",{src:t.image||"https://via.placeholder.com/100?text=No+Image",alt:t.name,className:"item-image"}),a("div",{className:"item-details",children:[e("h3",{className:"item-name",children:t.name}),t.sku&&a("div",{className:"item-sku",children:["SKU: ",t.sku]}),a("div",{className:"item-price",children:["$",t.price.toFixed(2)]}),a("div",{className:"item-actions",children:[a("div",{className:"quantity-controls",children:[e("button",{className:"qty-btn",onClick:()=>c(t.id,t.quantity-1),children:"\u2212"}),e("span",{className:"qty-value",children:t.quantity}),e("button",{className:"qty-btn",onClick:()=>c(t.id,t.quantity+1),children:"+"})]}),e("button",{className:"remove-btn",onClick:()=>y(t.id),children:"Remove"})]})]}),e("div",{className:"item-subtotal",children:a("div",{className:"subtotal-amount",children:["$",(t.price*t.quantity).toFixed(2)]})})]},t.id))}),a("div",{className:"cart-summary",children:[e("h2",{className:"summary-title",children:"Order Summary"}),a("div",{className:"summary-row",children:[e("span",{className:"summary-label",children:"Subtotal"}),a("span",{className:"summary-value",children:["$",f.toFixed(2)]})]}),a("div",{className:"summary-row",children:[e("span",{className:"summary-label",children:"Tax (10%)"}),a("span",{className:"summary-value",children:["$",x.toFixed(2)]})]}),a("div",{className:"summary-row",children:[e("span",{className:"summary-label",children:"Shipping"}),a("span",{className:"summary-value",children:["$",N.toFixed(2)]})]}),a("div",{className:"summary-row",children:[e("span",{className:"summary-label",children:"Total"}),a("span",{className:"summary-value",children:["$",S.toFixed(2)]})]}),e("button",{className:"checkout-btn",onClick:g,children:"Proceed to Checkout"}),e("button",{className:"continue-shopping",onClick:v,children:"Continue Shopping"})]})]})]})}var k=document.getElementById("shopping-cart-root");k&&I.createRoot(k).render(e(R,{}));
//# sourceMappingURL=shopping-cart.js.map
