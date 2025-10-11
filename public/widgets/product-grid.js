import{useState as w,useEffect as y}from"react";import A from"react-dom/client";import{useEffect as T,useState as _}from"react";function p(){let[o,a]=_(null);return T(()=>{typeof window<"u"&&window.openai&&a(window.openai)},[]),o}import{useState as z,useEffect as O}from"react";function h(o){let a=p(),[s,r]=z(o);return O(()=>{if(a?.widgetState){let i=a.widgetState.get();i&&Object.keys(i).length>0&&r({...o,...i})}},[a]),[s,i=>{r(d=>{let u=typeof i=="function"?i(d):i,m={...d,...u};return a?.widgetState&&a.widgetState.set(m),m})}]}import{jsx as t,jsxs as c}from"react/jsx-runtime";function L(){let o=window.openai?.toolInput,a=o||{},s=a?.data?.products||a?.products||[];console.log("ProductGrid render:",{hasToolInput:!!o,apiResponse:a,productsCount:s.length});let[r,x]=h({cart:{items:[],total:0}}),i=p("displayMode"),[d,u]=w(""),[m,g]=w([]),[S,N]=w(!0);y(()=>{o!==void 0&&N(!1)},[o]),y(()=>{g(s)},[s.length]),y(()=>{if(d.trim()==="")g(s);else{let e=s.filter(n=>n.product_name.toLowerCase().includes(d.toLowerCase())||n.sku?.toLowerCase().includes(d.toLowerCase()));g(e)}},[d,s]);let C=e=>{let n=r.cart.items.find(l=>l.id===e.id),f=e.price||0,b;n?b={items:r.cart.items.map(l=>l.id===e.id?{...l,quantity:l.quantity+1}:l),total:r.cart.total+f}:b={items:[...r.cart.items,{id:e.id,name:e.product_name,price:f,quantity:1,image:"https://via.placeholder.com/100"}],total:r.cart.total+f},x({cart:b}),window.openai?.sendMessage(`Added ${e.product_name} to cart (Price TBD)`)},P=()=>{window.openai?.sendMessage("Show my cart")},I=e=>!e||e===0?{label:"Out of Stock",className:"stock-out"}:e<=5?{label:`Low (${e})`,className:"stock-low"}:{label:`In Stock (${e})`,className:"stock-in"},v=r.cart.items.reduce((e,n)=>e+n.quantity,0);return S?c("div",{className:"product-grid-container loading",children:[t("style",{children:`
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
        `}),c("div",{className:"loading-content",children:[t("div",{className:"loading-spinner"}),t("h2",{children:"Loading Products..."}),t("p",{children:"Waiting for data"})]})]}):c("div",{className:`product-grid-container ${i}`,children:[t("style",{children:`
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
      `}),c("div",{className:"product-grid-header",children:[t("h1",{className:"product-grid-title",children:"Products"}),v>0&&c("div",{className:"cart-badge",onClick:P,children:["\u{1F6D2} Cart",t("span",{className:"cart-count",children:v})]})]}),t("div",{className:"search-bar",children:t("input",{type:"text",className:"search-input",placeholder:"Search products by name or SKU...",value:d,onChange:e=>u(e.target.value)})}),m.length===0?c("div",{className:"empty-state",children:[t("div",{className:"empty-icon",children:"\u{1F4E6}"}),t("h2",{children:"No products found"}),t("p",{children:"Try adjusting your search or filters"})]}):t("div",{className:"product-grid",children:m.map(e=>{let n=I(e.stock);return c("div",{className:"product-card",children:[t("img",{src:"https://via.placeholder.com/300x200?text="+encodeURIComponent(e.product_name),alt:e.product_name,className:"product-image"}),c("div",{className:"product-info",children:[t("h3",{className:"product-name",children:e.product_name}),e.category&&t("p",{className:"product-description",children:e.category}),t("div",{className:"product-price",children:e.price?`$${e.price.toFixed(2)}`:"Price TBD"}),t("span",{className:`stock-badge ${n.className}`,children:n.label}),t("button",{className:"add-to-cart-btn",onClick:()=>C(e),disabled:!e.stock||e.stock===0,children:e.stock&&e.stock>0?"Add to Cart":"Out of Stock"})]})]},e.id)})})]})}var k=document.getElementById("product-grid-root");k&&A.createRoot(k).render(t(L,{}));
//# sourceMappingURL=product-grid.js.map
