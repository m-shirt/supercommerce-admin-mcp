import{useState as P,useEffect as T,useMemo as x}from"react";import I from"react-dom/client";import{useEffect as S,useState as N}from"react";function w(){let[a,r]=N(null);return S(()=>{typeof window<"u"&&window.openai&&r(window.openai)},[]),a}import{useState as O,useEffect as C}from"react";function h(a){let r=w(),[m,s]=O(a);return C(()=>{if(r?.widgetState){let n=r.widgetState.get();n&&Object.keys(n).length>0&&s({...a,...n})}},[r]),[m,n=>{s(p=>{let g=typeof n=="function"?n(p):n,l={...p,...g};return r?.widgetState&&r.widgetState.set(l),l})}]}import{jsx as o,jsxs as i}from"react/jsx-runtime";function _(){let[a,r]=h({cart:{items:[],total:0}}),m=window.openai?.displayMode||"inline",s=x(()=>{let t=window.openai?.toolOutput;if(t?.result?.content?.[0]?.text)try{let e=JSON.parse(t.result.content[0].text);return console.log("Parsed API response:",e),e?.data?.products||e?.products||[]}catch(e){console.error("Failed to parse toolOutput.result.content[0].text:",e)}if(t?.content?.[0]?.text)try{let e=JSON.parse(t.content[0].text);return console.log("Parsed API response (direct):",e),e?.data?.products||e?.products||[]}catch(e){console.error("Failed to parse toolOutput.content[0].text:",e)}if(typeof t=="string")try{let e=JSON.parse(t);return e?.data?.products||e?.products||[]}catch(e){console.error("Failed to parse toolOutput string:",e)}return t?.data?.products?t.data.products:(console.log("No products found. toolOutput:",t),[])},[window.openai?.toolOutput]),[d,n]=P(""),p=x(()=>d.trim()===""?s:s.filter(t=>t.product_name.toLowerCase().includes(d.toLowerCase())||t.sku?.toLowerCase().includes(d.toLowerCase())),[s,d]),g=t=>{let e=a.cart.items.find(c=>c.id===t.id),f=t.price||0,b;e?b={items:a.cart.items.map(c=>c.id===t.id?{...c,quantity:c.quantity+1}:c),total:a.cart.total+f}:b={items:[...a.cart.items,{id:t.id,name:t.product_name,price:f,quantity:1,image:"https://via.placeholder.com/100"}],total:a.cart.total+f},r({cart:b}),window.openai?.sendMessage(`Added ${t.product_name} to cart (Price TBD)`)},l=()=>{window.openai?.sendMessage("Show my cart")},k=t=>!t||t===0?{label:"Out of Stock",className:"stock-out"}:t<=5?{label:`Low (${t})`,className:"stock-low"}:{label:`In Stock (${t})`,className:"stock-in"},y=a.cart.items.reduce((t,e)=>t+e.quantity,0);T(()=>{console.log("window.openai:",window.openai),console.log("toolOutput:",window.openai?.toolOutput)},[window.openai?.toolOutput]);let u=window.openai?.toolOutput;return u?.result?.content?.[0]?.text||u?.content?.[0]?.text||typeof u=="string"||u?.data?.products?i("div",{className:`product-grid-container ${m}`,children:[o("style",{children:`
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
      `}),i("div",{className:"product-grid-header",children:[o("h1",{className:"product-grid-title",children:"Products"}),y>0&&i("div",{className:"cart-badge",onClick:l,children:["\u{1F6D2} Cart",o("span",{className:"cart-count",children:y})]})]}),o("div",{className:"search-bar",children:o("input",{type:"text",className:"search-input",placeholder:"Search products by name or SKU...",value:d,onChange:t=>n(t.target.value)})}),p.length===0?i("div",{className:"empty-state",children:[o("div",{className:"empty-icon",children:"\u{1F4E6}"}),o("h2",{children:"No products found"}),o("p",{children:"Try adjusting your search or filters"})]}):o("div",{className:"product-grid",children:p.map(t=>{let e=k(t.stock);return i("div",{className:"product-card",children:[o("img",{src:"https://via.placeholder.com/300x200?text="+encodeURIComponent(t.product_name),alt:t.product_name,className:"product-image"}),i("div",{className:"product-info",children:[o("h3",{className:"product-name",children:t.product_name}),t.category&&o("p",{className:"product-description",children:t.category}),o("div",{className:"product-price",children:t.price?`$${t.price.toFixed(2)}`:"Price TBD"}),o("span",{className:`stock-badge ${e.className}`,children:e.label}),o("button",{className:"add-to-cart-btn",onClick:()=>g(t),disabled:!t.stock||t.stock===0,children:t.stock&&t.stock>0?"Add to Cart":"Out of Stock"})]})]},t.id)})})]}):i("div",{className:"product-grid-container loading",children:[o("style",{children:`
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
        `}),i("div",{className:"loading-content",children:[o("div",{className:"loading-spinner"}),o("h2",{children:"Loading Products..."}),o("p",{children:"Waiting for data"})]})]})}var v=document.getElementById("product-grid-root");v&&I.createRoot(v).render(o(_,{}));
