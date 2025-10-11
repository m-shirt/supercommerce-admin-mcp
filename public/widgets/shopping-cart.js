import{useState as z,useEffect as F,useMemo as I}from"react";import R from"react-dom/client";import{useEffect as C,useState as q}from"react";function p(){let[o,s]=q(null);return C(()=>{typeof window<"u"&&window.openai&&s(window.openai)},[]),o}import{useState as O,useEffect as T}from"react";function w(o){let s=p(),[u,n]=O(o);return T(()=>{if(s?.widgetState){let c=s.widgetState.get();c&&Object.keys(c).length>0&&n({...o,...c})}},[s]),[u,c=>{n(m=>{let h=typeof c=="function"?c(m):c,g={...m,...h};return s?.widgetState&&s.widgetState.set(g),g})}]}import{jsx as e,jsxs as a}from"react/jsx-runtime";function E(){let[o,s]=z(window.openai?.toolOutput);F(()=>{let t=setInterval(()=>{let i=window.openai?.toolOutput;i!==o&&s(i)},100);return()=>clearInterval(t)},[o]);let u=I(()=>{if(o?.result?.content?.[0]?.text)try{let t=JSON.parse(o.result.content[0].text);return t?.items||t?.cart?.items||[]}catch(t){console.error("Failed to parse cart data:",t)}if(o?.content?.[0]?.text)try{let t=JSON.parse(o.content[0].text);return t?.items||t?.cart?.items||[]}catch(t){console.error("Failed to parse cart data:",t)}return[]},[o]),[n,b]=w({cart:{items:u,total:u.reduce((t,i)=>t+i.price*i.quantity,0)}}),c=p("displayMode"),m=(t,i)=>{if(i<1)return;let d=n.cart.items.map(r=>r.id===t?{...r,quantity:i}:r),y=d.reduce((r,l)=>r+l.price*l.quantity,0);b({cart:{items:d,total:y}})},h=t=>{let i=n.cart.items.find(r=>r.id===t),d=n.cart.items.filter(r=>r.id!==t),y=d.reduce((r,l)=>r+l.price*l.quantity,0);b({cart:{items:d,total:y}}),i&&window.openai?.sendFollowUpMessage?.(`Removed ${i.name} from cart`)},g=()=>{window.openai?.sendFollowUpMessage?.("Proceed to checkout")},x=()=>{window.openai?.sendFollowUpMessage?.("Show products")},f=n.cart.total,v=f*.1,N=f>0?15:0,S=f+v+N;return o?a("div",{className:`shopping-cart-container ${c}`,children:[e("style",{children:`
        .shopping-cart-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
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
      `}),a("div",{className:"cart-header",children:[e("h1",{className:"cart-title",children:"Shopping Cart"}),a("span",{className:"item-count",children:[n.cart.items.length," ",n.cart.items.length===1?"item":"items"]})]}),n.cart.items.length===0?a("div",{className:"empty-cart",children:[e("div",{className:"empty-icon",children:"\u{1F6D2}"}),e("h2",{children:"Your cart is empty"}),e("p",{children:"Add some products to get started"}),e("button",{className:"checkout-btn",onClick:x,children:"Browse Products"})]}):a("div",{className:"cart-content",children:[e("div",{className:"cart-items",children:n.cart.items.map(t=>a("div",{className:"cart-item",children:[e("img",{src:t.image||"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E",alt:t.name,className:"item-image"}),a("div",{className:"item-details",children:[e("h3",{className:"item-name",children:t.name}),t.sku&&a("div",{className:"item-sku",children:["SKU: ",t.sku]}),a("div",{className:"item-price",children:["$",t.price.toFixed(2)]}),a("div",{className:"item-actions",children:[a("div",{className:"quantity-controls",children:[e("button",{className:"qty-btn",onClick:()=>m(t.id,t.quantity-1),children:"\u2212"}),e("span",{className:"qty-value",children:t.quantity}),e("button",{className:"qty-btn",onClick:()=>m(t.id,t.quantity+1),children:"+"})]}),e("button",{className:"remove-btn",onClick:()=>h(t.id),children:"Remove"})]})]}),e("div",{className:"item-subtotal",children:a("div",{className:"subtotal-amount",children:["$",(t.price*t.quantity).toFixed(2)]})})]},t.id))}),a("div",{className:"cart-summary",children:[e("h2",{className:"summary-title",children:"Order Summary"}),a("div",{className:"summary-row",children:[e("span",{className:"summary-label",children:"Subtotal"}),a("span",{className:"summary-value",children:["$",f.toFixed(2)]})]}),a("div",{className:"summary-row",children:[e("span",{className:"summary-label",children:"Tax (10%)"}),a("span",{className:"summary-value",children:["$",v.toFixed(2)]})]}),a("div",{className:"summary-row",children:[e("span",{className:"summary-label",children:"Shipping"}),a("span",{className:"summary-value",children:["$",N.toFixed(2)]})]}),a("div",{className:"summary-row",children:[e("span",{className:"summary-label",children:"Total"}),a("span",{className:"summary-value",children:["$",S.toFixed(2)]})]}),e("button",{className:"checkout-btn",onClick:g,children:"Proceed to Checkout"}),e("button",{className:"continue-shopping",onClick:x,children:"Continue Shopping"})]})]})]}):a("div",{className:"shopping-cart-container loading",children:[e("style",{children:`
          .shopping-cart-container.loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .loading-content {
            text-align: center;
            color: white;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}),a("div",{className:"loading-content",children:[e("div",{className:"loading-spinner"}),e("h2",{children:"Loading Cart..."}),e("p",{children:"Waiting for data"})]})]})}var k=document.getElementById("shopping-cart-root");k&&R.createRoot(k).render(e(E,{}));
