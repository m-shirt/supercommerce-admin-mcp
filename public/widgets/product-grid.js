import{useState as O,useMemo as y}from"react";import P from"react-dom/client";import{useEffect as v,useState as S}from"react";function b(){let[r,a]=S(null);return v(()=>{typeof window<"u"&&window.openai&&a(window.openai)},[]),r}import{useState as N,useEffect as C}from"react";function h(r){let a=b(),[m,n]=N(r);return C(()=>{if(a?.widgetState){let i=a.widgetState.get();i&&Object.keys(i).length>0&&n({...r,...i})}},[a]),[m,i=>{n(p=>{let u=typeof i=="function"?i(p):i,l={...p,...u};return a?.widgetState&&a.widgetState.set(l),l})}]}import{jsx as o,jsxs as c}from"react/jsx-runtime";function T(){let[r,a]=h({cart:{items:[],total:0}}),m=window.openai?.displayMode||"inline",n=y(()=>{let t=window.openai?.toolOutput;if(t?.content?.[0]?.text)try{let e=JSON.parse(t.content[0].text);return console.log("Parsed API response:",e),e?.data?.products||e?.products||[]}catch(e){console.error("Failed to parse toolOutput.content[0].text:",e)}if(typeof t=="string")try{let e=JSON.parse(t);return e?.data?.products||e?.products||[]}catch(e){console.error("Failed to parse toolOutput string:",e)}return t?.data?.products?t.data.products:(console.log("No products found. toolOutput:",t),[])},[window.openai?.toolOutput]),[s,i]=O(""),p=y(()=>s.trim()===""?n:n.filter(t=>t.product_name.toLowerCase().includes(s.toLowerCase())||t.sku?.toLowerCase().includes(s.toLowerCase())),[n,s]),u=t=>{let e=r.cart.items.find(d=>d.id===t.id),g=t.price||0,f;e?f={items:r.cart.items.map(d=>d.id===t.id?{...d,quantity:d.quantity+1}:d),total:r.cart.total+g}:f={items:[...r.cart.items,{id:t.id,name:t.product_name,price:g,quantity:1,image:"https://via.placeholder.com/100"}],total:r.cart.total+g},a({cart:f}),window.openai?.sendMessage(`Added ${t.product_name} to cart (Price TBD)`)},l=()=>{window.openai?.sendMessage("Show my cart")},k=t=>!t||t===0?{label:"Out of Stock",className:"stock-out"}:t<=5?{label:`Low (${t})`,className:"stock-low"}:{label:`In Stock (${t})`,className:"stock-in"},w=r.cart.items.reduce((t,e)=>t+e.quantity,0);return c("div",{className:`product-grid-container ${m}`,children:[o("style",{children:`
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
      `}),c("div",{className:"product-grid-header",children:[o("h1",{className:"product-grid-title",children:"Products"}),w>0&&c("div",{className:"cart-badge",onClick:l,children:["\u{1F6D2} Cart",o("span",{className:"cart-count",children:w})]})]}),o("div",{className:"search-bar",children:o("input",{type:"text",className:"search-input",placeholder:"Search products by name or SKU...",value:s,onChange:t=>i(t.target.value)})}),p.length===0?c("div",{className:"empty-state",children:[o("div",{className:"empty-icon",children:"\u{1F4E6}"}),o("h2",{children:"No products found"}),o("p",{children:"Try adjusting your search or filters"})]}):o("div",{className:"product-grid",children:p.map(t=>{let e=k(t.stock);return c("div",{className:"product-card",children:[o("img",{src:"https://via.placeholder.com/300x200?text="+encodeURIComponent(t.product_name),alt:t.product_name,className:"product-image"}),c("div",{className:"product-info",children:[o("h3",{className:"product-name",children:t.product_name}),t.category&&o("p",{className:"product-description",children:t.category}),o("div",{className:"product-price",children:t.price?`$${t.price.toFixed(2)}`:"Price TBD"}),o("span",{className:`stock-badge ${e.className}`,children:e.label}),o("button",{className:"add-to-cart-btn",onClick:()=>u(t),disabled:!t.stock||t.stock===0,children:t.stock&&t.stock>0?"Add to Cart":"Out of Stock"})]})]},t.id)})})]})}var x=document.getElementById("product-grid-root");x&&P.createRoot(x).render(o(T,{}));
//# sourceMappingURL=product-grid.js.map
