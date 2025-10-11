import{useState as y,useEffect as x}from"react";import L from"react-dom/client";import{useEffect as O,useState as _}from"react";function m(){let[o,a]=_(null);return O(()=>{typeof window<"u"&&window.openai&&a(window.openai)},[]),o}import{useState as z,useEffect as A}from"react";function w(o){let a=m(),[d,r]=z(o);return A(()=>{if(a?.widgetState){let i=a.widgetState.get();i&&Object.keys(i).length>0&&r({...o,...i})}},[a]),[d,i=>{r(u=>{let l=typeof i=="function"?i(u):i,g={...u,...l};return a?.widgetState&&a.widgetState.set(g),g})}]}import{jsx as t,jsxs as s}from"react/jsx-runtime";function B(){let o=window.openai?.toolOutput,a=window.openai?.toolInput,d=o;if(typeof o=="string")try{d=JSON.parse(o)}catch(e){console.error("Failed to parse toolOutput:",e),d={}}let r=d?.data?.products||d?.products||[];console.log("ProductGrid render:",{hasToolInput:!!a,hasToolOutput:!!o,toolOutput:o,apiResponse:d,productsCount:r.length});let[c,i]=w({cart:{items:[],total:0}}),u=m("displayMode"),[l,g]=y(""),[v,f]=y([]),[N,C]=y(!0);x(()=>{o!==void 0&&C(!1)},[o]),x(()=>{f(r)},[r.length]),x(()=>{if(l.trim()==="")f(r);else{let e=r.filter(n=>n.product_name.toLowerCase().includes(l.toLowerCase())||n.sku?.toLowerCase().includes(l.toLowerCase()));f(e)}},[l,r]);let P=e=>{let n=c.cart.items.find(p=>p.id===e.id),b=e.price||0,h;n?h={items:c.cart.items.map(p=>p.id===e.id?{...p,quantity:p.quantity+1}:p),total:c.cart.total+b}:h={items:[...c.cart.items,{id:e.id,name:e.product_name,price:b,quantity:1,image:"https://via.placeholder.com/100"}],total:c.cart.total+b},i({cart:h}),window.openai?.sendMessage(`Added ${e.product_name} to cart (Price TBD)`)},T=()=>{window.openai?.sendMessage("Show my cart")},I=e=>!e||e===0?{label:"Out of Stock",className:"stock-out"}:e<=5?{label:`Low (${e})`,className:"stock-low"}:{label:`In Stock (${e})`,className:"stock-in"},k=c.cart.items.reduce((e,n)=>e+n.quantity,0);return N?s("div",{className:"product-grid-container loading",children:[t("style",{children:`
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
        `}),s("div",{className:"loading-content",children:[t("div",{className:"loading-spinner"}),t("h2",{children:"Loading Products..."}),t("p",{children:"Waiting for data"})]})]}):s("div",{className:`product-grid-container ${u}`,children:[t("style",{children:`
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
          width: 100%;
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
      `}),s("div",{className:"product-grid-header",children:[t("h1",{className:"product-grid-title",children:"Products"}),k>0&&s("div",{className:"cart-badge",onClick:T,children:["\u{1F6D2} Cart",t("span",{className:"cart-count",children:k})]})]}),t("div",{className:"search-bar",children:t("input",{type:"text",className:"search-input",placeholder:"Search products by name or SKU...",value:l,onChange:e=>g(e.target.value)})}),v.length===0?s("div",{className:"empty-state",children:[t("div",{className:"empty-icon",children:"\u{1F4E6}"}),t("h2",{children:"No products found"}),t("p",{children:"Try adjusting your search or filters"})]}):t("div",{className:"product-grid",children:v.map(e=>{let n=I(e.stock);return s("div",{className:"product-card",children:[t("img",{src:"https://via.placeholder.com/300x200?text="+encodeURIComponent(e.product_name),alt:e.product_name,className:"product-image"}),s("div",{className:"product-info",children:[t("h3",{className:"product-name",children:e.product_name}),e.category&&t("p",{className:"product-description",children:e.category}),t("div",{className:"product-price",children:e.price?`$${e.price.toFixed(2)}`:"Price TBD"}),t("span",{className:`stock-badge ${n.className}`,children:n.label}),t("button",{className:"add-to-cart-btn",onClick:()=>P(e),disabled:!e.stock||e.stock===0,children:e.stock&&e.stock>0?"Add to Cart":"Out of Stock"})]})]},e.id)})})]})}var S=document.getElementById("product-grid-root");S&&L.createRoot(S).render(t(B,{}));
//# sourceMappingURL=product-grid.js.map
