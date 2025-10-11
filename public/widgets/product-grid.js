import{useState as x,useEffect as _}from"react";import z from"react-dom/client";import{useEffect as C,useState as T}from"react";function p(){let[m,a]=T(null);return C(()=>{typeof window<"u"&&window.openai&&a(window.openai)},[]),m}import{useState as I,useEffect as P}from"react";function b(m){let a=p(),[s,r]=I(m);return P(()=>{if(a?.widgetState){let o=a.widgetState.get();o&&Object.keys(o).length>0&&r({...m,...o})}},[a]),[s,o=>{r(n=>{let u=typeof o=="function"?o(n):o,l={...n,...u};return a?.widgetState&&a.widgetState.set(l),l})}]}import{jsx as t,jsxs as c}from"react/jsx-runtime";function O(){let a=window.openai?.toolInput||{},s=a?.data?.products||a?.products||[],[r,h]=b({cart:{items:[],total:0}}),o=p("displayMode"),[n,u]=x(""),[l,w]=x(s);_(()=>{if(n.trim()==="")w(s);else{let e=s.filter(i=>i.product_name.toLowerCase().includes(n.toLowerCase())||i.sku?.toLowerCase().includes(n.toLowerCase()));w(e)}},[n,s]);let v=e=>{let i=r.cart.items.find(d=>d.id===e.id),g=e.price||0,f;i?f={items:r.cart.items.map(d=>d.id===e.id?{...d,quantity:d.quantity+1}:d),total:r.cart.total+g}:f={items:[...r.cart.items,{id:e.id,name:e.product_name,price:g,quantity:1,image:"https://via.placeholder.com/100"}],total:r.cart.total+g},h({cart:f}),window.openai?.sendMessage(`Added ${e.product_name} to cart (Price TBD)`)},S=()=>{window.openai?.sendMessage("Show my cart")},N=e=>!e||e===0?{label:"Out of Stock",className:"stock-out"}:e<=5?{label:`Low (${e})`,className:"stock-low"}:{label:`In Stock (${e})`,className:"stock-in"},y=r.cart.items.reduce((e,i)=>e+i.quantity,0);return c("div",{className:`product-grid-container ${o}`,children:[t("style",{children:`
        .product-grid-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
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
      `}),c("div",{className:"product-grid-header",children:[t("h1",{className:"product-grid-title",children:"Products"}),y>0&&c("div",{className:"cart-badge",onClick:S,children:["\u{1F6D2} Cart",t("span",{className:"cart-count",children:y})]})]}),t("div",{className:"search-bar",children:t("input",{type:"text",className:"search-input",placeholder:"Search products by name or SKU...",value:n,onChange:e=>u(e.target.value)})}),l.length===0?c("div",{className:"empty-state",children:[t("div",{className:"empty-icon",children:"\u{1F4E6}"}),t("h2",{children:"No products found"}),t("p",{children:"Try adjusting your search or filters"})]}):t("div",{className:"product-grid",children:l.map(e=>{let i=N(e.stock);return c("div",{className:"product-card",children:[t("img",{src:"https://via.placeholder.com/300x200?text="+encodeURIComponent(e.product_name),alt:e.product_name,className:"product-image"}),c("div",{className:"product-info",children:[t("h3",{className:"product-name",children:e.product_name}),e.category&&t("p",{className:"product-description",children:e.category}),t("div",{className:"product-price",children:e.price?`$${e.price.toFixed(2)}`:"Price TBD"}),t("span",{className:`stock-badge ${i.className}`,children:i.label}),t("button",{className:"add-to-cart-btn",onClick:()=>v(e),disabled:!e.stock||e.stock===0,children:e.stock&&e.stock>0?"Add to Cart":"Out of Stock"})]})]},e.id)})})]})}var k=document.getElementById("product-grid-root");k&&z.createRoot(k).render(t(O,{}));
//# sourceMappingURL=product-grid.js.map
