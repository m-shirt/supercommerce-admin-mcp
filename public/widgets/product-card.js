import{useState as y,useEffect as q,useMemo as O}from"react";import P from"react-dom/client";import{useEffect as N,useState as S}from"react";function p(){let[i,c]=S(null);return N(()=>{typeof window<"u"&&window.openai&&c(window.openai)},[]),i}import{useState as z,useEffect as C}from"react";function f(i){let c=p(),[t,l]=z(i);return C(()=>{if(c?.widgetState){let s=c.widgetState.get();s&&Object.keys(s).length>0&&l({...i,...s})}},[c]),[t,s=>{l(g=>{let r=typeof s=="function"?s(g):s,u={...g,...r};return c?.widgetState&&c.widgetState.set(u),u})}]}import{jsx as e,jsxs as o}from"react/jsx-runtime";function T(){let[i,c]=y(window.openai?.toolOutput);q(()=>{let a=setInterval(()=>{let n=window.openai?.toolOutput;n!==i&&c(n)},100);return()=>clearInterval(a)},[i]);let t=O(()=>{if(i?.result?.content?.[0]?.text)try{let a=JSON.parse(i.result.content[0].text);return a?.product||a||l()}catch(a){console.error("Failed to parse product:",a)}if(i?.content?.[0]?.text)try{let a=JSON.parse(i.content[0].text);return a?.product||a||l()}catch(a){console.error("Failed to parse product:",a)}return l()},[i]);function l(){return{id:0,name:"Sample Product",description:"Product description not available",price:0,image:"",stock:0,sku:"N/A",category:"Uncategorized",brand:"Unknown"}}let[d,s]=f({cart:{items:[],total:0}}),g=p("displayMode"),[r,u]=y(1),[A,I]=y(t.image),h=a=>{let n=r+a;n>=1&&n<=t.stock&&u(n)},k=()=>{let a=d.cart.items.find(m=>m.id===t.id),n;a?n={items:d.cart.items.map(m=>m.id===t.id?{...m,quantity:m.quantity+r}:m),total:d.cart.total+t.price*r}:n={items:[...d.cart.items,{id:t.id,name:t.name,price:t.price,quantity:r,image:t.image}],total:d.cart.total+t.price*r},s({cart:n}),window.openai?.sendFollowUpMessage?.(`Added ${r} x ${t.name} to cart ($${(t.price*r).toFixed(2)})`),u(1)},w=()=>{window.openai?.sendFollowUpMessage?.("Show all products")},b=t.stock===0?{label:"Out of Stock",color:"#ef4444",bgColor:"#fee2e2"}:t.stock<=5?{label:`Only ${t.stock} left`,color:"#f59e0b",bgColor:"#fef3c7"}:{label:`${t.stock} in stock`,color:"#10b981",bgColor:"#d1fae5"},x=t.price*r;return o("div",{className:`product-card-container ${g}`,children:[e("style",{children:`
        .product-card-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
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
      `}),o("div",{className:"card-header",children:[e("h1",{className:"header-title",children:"Product Details"}),e("button",{className:"back-btn",onClick:w,children:"\u2190 View All Products"})]}),e("div",{className:"product-detail",children:o("div",{className:"product-layout",children:[e("div",{className:"product-images",children:e("div",{className:"main-image",children:t.image?e("img",{src:t.image,alt:t.name}):e("div",{className:"placeholder-icon",children:"\u{1F4E6}"})})}),o("div",{className:"product-info",children:[o("div",{className:"product-header",children:[e("h2",{className:"product-name",children:t.name}),o("div",{className:"product-sku",children:["SKU: ",t.sku]}),o("div",{className:"product-badges",children:[t.category&&e("span",{className:"badge category-badge",children:t.category}),t.brand&&e("span",{className:"badge brand-badge",children:t.brand})]}),e("div",{className:"stock-badge",style:{backgroundColor:b.bgColor,color:b.color},children:b.label})]}),o("div",{className:"product-price",children:["$",t.price.toFixed(2)]}),t.description&&e("div",{className:"product-description",children:t.description}),o("div",{className:"quantity-section",children:[e("div",{className:"section-label",children:"Quantity"}),o("div",{className:"quantity-controls",children:[e("button",{className:"qty-btn",onClick:()=>h(-1),disabled:r<=1,children:"\u2212"}),e("span",{className:"qty-value",children:r}),e("button",{className:"qty-btn",onClick:()=>h(1),disabled:r>=t.stock,children:"+"})]})]}),o("div",{className:"price-summary",children:[e("span",{className:"summary-label",children:"Total Price"}),o("span",{className:"summary-value",children:["$",x.toFixed(2)]})]}),o("div",{className:"action-buttons",children:[e("button",{className:"add-to-cart-btn",onClick:k,disabled:t.stock===0,children:t.stock>0?"Add to Cart":"Out of Stock"}),e("button",{className:"view-all-btn",onClick:w,children:"Continue Shopping"})]}),d.cart.items.length>0&&o("div",{className:"cart-indicator",children:[o("div",{className:"cart-count",children:[d.cart.items.reduce((a,n)=>a+n.quantity,0)," items in cart"]}),o("div",{className:"cart-total",children:["$",d.cart.total.toFixed(2)]})]})]})]})})]})}var v=document.getElementById("product-card-root");v&&P.createRoot(v).render(e(T,{}));
