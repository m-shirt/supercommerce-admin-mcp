import{useState as v}from"react";import q from"react-dom/client";import{useEffect as N,useState as S}from"react";function m(){let[s,i]=S(null);return N(()=>{typeof window<"u"&&window.openai&&i(window.openai)},[]),s}import{useState as z,useEffect as C}from"react";function b(s){let i=m(),[e,r]=z(s);return C(()=>{if(i?.widgetState){let n=i.widgetState.get();n&&Object.keys(n).length>0&&r({...s,...n})}},[i]),[e,n=>{r(o=>{let p=typeof n=="function"?n(o):n,u={...o,...p};return i?.widgetState&&i.widgetState.set(u),u})}]}import{jsx as t,jsxs as a}from"react/jsx-runtime";function P(){let i=window.openai?.toolInput||{},e=i?.product||i||{id:0,name:"Sample Product",description:"Product description not available",price:0,image:"",stock:0,sku:"N/A",category:"Uncategorized",brand:"Unknown"},[r,f]=b({cart:{items:[],total:0}}),n=m("displayMode"),[o,p]=v(1),[u,A]=v(e.image),y=l=>{let d=o+l;d>=1&&d<=e.stock&&p(d)},k=()=>{let l=r.cart.items.find(c=>c.id===e.id),d;l?d={items:r.cart.items.map(c=>c.id===e.id?{...c,quantity:c.quantity+o}:c),total:r.cart.total+e.price*o}:d={items:[...r.cart.items,{id:e.id,name:e.name,price:e.price,quantity:o,image:e.image}],total:r.cart.total+e.price*o},f({cart:d}),window.openai?.sendMessage(`Added ${o} x ${e.name} to cart ($${(e.price*o).toFixed(2)})`),p(1)},h=()=>{window.openai?.sendMessage("Show all products")},g=e.stock===0?{label:"Out of Stock",color:"#ef4444",bgColor:"#fee2e2"}:e.stock<=5?{label:`Only ${e.stock} left`,color:"#f59e0b",bgColor:"#fef3c7"}:{label:`${e.stock} in stock`,color:"#10b981",bgColor:"#d1fae5"},x=e.price*o;return a("div",{className:`product-card-container ${n}`,children:[t("style",{children:`
        .product-card-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .header-title {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .back-btn {
          padding: 0.5rem 1rem;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #f3f4f6;
        }

        .product-detail {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .product-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .product-card-container:not(.pip) .product-layout {
          grid-template-columns: 1fr 1fr;
        }

        .product-images {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .main-image {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: 12px;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

        .placeholder-icon {
          font-size: 5rem;
          color: #9ca3af;
        }

        .product-info {
          display: flex;
          flex-direction: column;
        }

        .product-header {
          margin-bottom: 1.5rem;
        }

        .product-name {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem;
          line-height: 1.2;
        }

        .product-sku {
          font-family: monospace;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .product-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .category-badge {
          background: #ede9fe;
          color: #6d28d9;
        }

        .brand-badge {
          background: #dbeafe;
          color: #1e40af;
        }

        .stock-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-top: 1rem;
        }

        .product-price {
          font-size: 3rem;
          font-weight: 700;
          color: #667eea;
          margin: 1.5rem 0;
        }

        .product-description {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .quantity-section {
          margin-bottom: 1.5rem;
        }

        .section-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.75rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 0.5rem;
          width: fit-content;
        }

        .qty-btn {
          width: 40px;
          height: 40px;
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

        .qty-btn:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .qty-value {
          min-width: 60px;
          text-align: center;
          font-weight: 700;
          font-size: 1.25rem;
          color: #1f2937;
        }

        .price-summary {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .summary-label {
          font-size: 1rem;
          color: #6b7280;
        }

        .summary-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .add-to-cart-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .view-all-btn {
          width: 100%;
          padding: 1rem;
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-all-btn:hover {
          background: #f3f4f6;
        }

        .cart-indicator {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          text-align: center;
          border: 2px dashed #e5e7eb;
        }

        .cart-count {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .cart-total {
          font-size: 1.25rem;
          font-weight: 700;
          color: #667eea;
          margin-top: 0.25rem;
        }

        @media (max-width: 768px) {
          .product-card-container:not(.pip) .product-layout {
            grid-template-columns: 1fr;
          }

          .product-name {
            font-size: 1.5rem;
          }

          .product-price {
            font-size: 2rem;
          }

          .header-title {
            font-size: 1.25rem;
          }
        }
      `}),a("div",{className:"card-header",children:[t("h1",{className:"header-title",children:"Product Details"}),t("button",{className:"back-btn",onClick:h,children:"\u2190 View All Products"})]}),t("div",{className:"product-detail",children:a("div",{className:"product-layout",children:[t("div",{className:"product-images",children:t("div",{className:"main-image",children:e.image?t("img",{src:e.image,alt:e.name}):t("div",{className:"placeholder-icon",children:"\u{1F4E6}"})})}),a("div",{className:"product-info",children:[a("div",{className:"product-header",children:[t("h2",{className:"product-name",children:e.name}),a("div",{className:"product-sku",children:["SKU: ",e.sku]}),a("div",{className:"product-badges",children:[e.category&&t("span",{className:"badge category-badge",children:e.category}),e.brand&&t("span",{className:"badge brand-badge",children:e.brand})]}),t("div",{className:"stock-badge",style:{backgroundColor:g.bgColor,color:g.color},children:g.label})]}),a("div",{className:"product-price",children:["$",e.price.toFixed(2)]}),e.description&&t("div",{className:"product-description",children:e.description}),a("div",{className:"quantity-section",children:[t("div",{className:"section-label",children:"Quantity"}),a("div",{className:"quantity-controls",children:[t("button",{className:"qty-btn",onClick:()=>y(-1),disabled:o<=1,children:"\u2212"}),t("span",{className:"qty-value",children:o}),t("button",{className:"qty-btn",onClick:()=>y(1),disabled:o>=e.stock,children:"+"})]})]}),a("div",{className:"price-summary",children:[t("span",{className:"summary-label",children:"Total Price"}),a("span",{className:"summary-value",children:["$",x.toFixed(2)]})]}),a("div",{className:"action-buttons",children:[t("button",{className:"add-to-cart-btn",onClick:k,disabled:e.stock===0,children:e.stock>0?"Add to Cart":"Out of Stock"}),t("button",{className:"view-all-btn",onClick:h,children:"Continue Shopping"})]}),r.cart.items.length>0&&a("div",{className:"cart-indicator",children:[a("div",{className:"cart-count",children:[r.cart.items.reduce((l,d)=>l+d.quantity,0)," items in cart"]}),a("div",{className:"cart-total",children:["$",r.cart.total.toFixed(2)]})]})]})]})})]})}var w=document.getElementById("product-card-root");w&&q.createRoot(w).render(t(P,{}));
