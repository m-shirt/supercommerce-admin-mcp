import{useState as y,useEffect as x,useMemo as v}from"react";import E from"react-dom/client";import{useEffect as O,useState as I}from"react";function f(){let[a,i]=I(null);return O(()=>{typeof window<"u"&&window.openai&&i(window.openai)},[]),a}import{useState as P,useEffect as T}from"react";function b(a){let i=f(),[o,m]=P(a);return T(()=>{if(i?.widgetState){let r=i.widgetState.get();r&&Object.keys(r).length>0&&m({...a,...r})}},[i]),[o,r=>{m(s=>{let u=typeof r=="function"?r(s):r,l={...s,...u};return i?.widgetState&&i.widgetState.set(l),l})}]}import{jsx as e,jsxs as d}from"react/jsx-runtime";function z(){let[a,i]=b({cart:{items:[],total:0}}),[o,m]=y(window.openai?.toolOutput);x(()=>{let t=setInterval(()=>{let n=window.openai?.toolOutput;n!==o&&m(n)},100);return()=>clearInterval(t)},[o]);let h=window.openai?.displayMode||"inline",r=v(()=>{if(o?.result?.content?.[0]?.text)try{let t=JSON.parse(o.result.content[0].text);return console.log("Parsed API response:",t),t?.data?.products||t?.products||[]}catch(t){console.error("Failed to parse toolOutput.result.content[0].text:",t)}if(o?.content?.[0]?.text)try{let t=JSON.parse(o.content[0].text);return console.log("Parsed API response (direct):",t),t?.data?.products||t?.products||[]}catch(t){console.error("Failed to parse toolOutput.content[0].text:",t)}if(typeof o=="string")try{let t=JSON.parse(o);return t?.data?.products||t?.products||[]}catch(t){console.error("Failed to parse toolOutput string:",t)}return o?.data?.products?o.data.products:(console.log("No products found. toolOutput:",o),[])},[o]),[s,u]=y(""),l=v(()=>s.trim()===""?r:r.filter(t=>t.product_name.toLowerCase().includes(s.toLowerCase())||t.sku?.toLowerCase().includes(s.toLowerCase())),[r,s]),S=t=>{let n=a.cart.items.find(c=>c.id===t.id),p=t.price||0,g;n?g={items:a.cart.items.map(c=>c.id===t.id?{...c,quantity:c.quantity+1}:c),total:a.cart.total+p}:g={items:[...a.cart.items,{id:t.id,name:t.product_name,price:p,quantity:1,image:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E"}],total:a.cart.total+p},i({cart:g}),window.openai?.sendMessage(`Added ${t.product_name} to cart (Price TBD)`)},N=()=>{window.openai?.sendMessage("Show my cart")},C=t=>!t||t===0?{label:"Out of Stock",className:"stock-out"}:t<=5?{label:`Low (${t})`,className:"stock-low"}:{label:`In Stock (${t})`,className:"stock-in"},w=a.cart.items.reduce((t,n)=>t+n.quantity,0);return x(()=>{console.log("Products loaded:",r.length)},[r.length]),r.length===0?d("div",{className:"product-grid-container loading",children:[e("style",{children:`
          .product-grid-container.loading {
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
        `}),d("div",{className:"loading-content",children:[e("div",{className:"loading-spinner"}),e("h2",{children:"Loading Products..."}),e("p",{children:"Waiting for data"})]})]}):d("div",{className:`product-grid-container ${h}`,children:[e("style",{children:`
        .product-grid-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
        }

        .product-grid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .product-grid-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .cart-badge {
          position: relative;
          background: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .cart-badge:hover {
          transform: scale(1.05);
        }

        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .search-bar {
          margin-bottom: 1.5rem;
        }

        .search-input {
          width: 50%;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .product-grid-container.pip .product-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          background: #f3f4f6;
        }

        .product-info {
          padding: 1rem;
        }

        .product-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-description {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .stock-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .stock-in {
          background: #d1fae5;
          color: #065f46;
        }

        .stock-low {
          background: #fef3c7;
          color: #92400e;
        }

        .stock-out {
          background: #fee2e2;
          color: #991b1b;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 0.75rem;
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

        .empty-state {
          text-align: center;
          color: white;
          padding: 4rem 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
          }

          .product-grid-title {
            font-size: 1.5rem;
          }
        }
      `}),d("div",{className:"product-grid-header",children:[e("h1",{className:"product-grid-title",children:"Products"}),w>0&&d("div",{className:"cart-badge",onClick:N,children:["\u{1F6D2} Cart",e("span",{className:"cart-count",children:w})]})]}),e("div",{className:"search-bar",children:e("input",{type:"text",className:"search-input",placeholder:"Search products by name or SKU...",value:s,onChange:t=>u(t.target.value)})}),l.length===0?d("div",{className:"empty-state",children:[e("div",{className:"empty-icon",children:"\u{1F4E6}"}),e("h2",{children:"No products found"}),e("p",{children:"Try adjusting your search or filters"})]}):e("div",{className:"product-grid",children:l.map(t=>{let n=C(t.stock),p=`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%239ca3af'%3E${encodeURIComponent(t.product_name.substring(0,30))}%3C/text%3E%3C/svg%3E`;return d("div",{className:"product-card",children:[e("img",{src:p,alt:t.product_name,className:"product-image"}),d("div",{className:"product-info",children:[e("h3",{className:"product-name",children:t.product_name}),t.category&&e("p",{className:"product-description",children:t.category}),e("div",{className:"product-price",children:t.price?`$${t.price.toFixed(2)}`:"Price TBD"}),e("span",{className:`stock-badge ${n.className}`,children:n.label}),e("button",{className:"add-to-cart-btn",onClick:()=>S(t),disabled:!t.stock||t.stock===0,children:t.stock&&t.stock>0?"Add to Cart":"Out of Stock"})]})]},t.id)})})]})}var k=document.getElementById("product-grid-root");k&&E.createRoot(k).render(e(z,{}));
