import{useState as y,useEffect as z}from"react";import O from"react-dom/client";import{useEffect as N,useState as C}from"react";function p(){let[m,a]=C(null);return N(()=>{typeof window<"u"&&window.openai&&a(window.openai)},[]),m}import{useState as I,useEffect as T}from"react";function f(m){let a=p(),[d,r]=I(m);return T(()=>{if(a?.widgetState){let o=a.widgetState.get();o&&Object.keys(o).length>0&&r({...m,...o})}},[a]),[d,o=>{r(n=>{let u=typeof o=="function"?o(n):o,l={...n,...u};return a?.widgetState&&a.widgetState.set(l),l})}]}import{jsx as t,jsxs as s}from"react/jsx-runtime";function P(){let a=window.openai?.toolInput||{},d=a?.data?.products||a?.products||[],[r,b]=f({cart:{items:[],total:0}}),o=p("displayMode"),[n,u]=y(""),[l,h]=y(d);z(()=>{if(n.trim()==="")h(d);else{let e=d.filter(i=>i.name.toLowerCase().includes(n.toLowerCase())||i.sku?.toLowerCase().includes(n.toLowerCase()));h(e)}},[n,d]);let k=e=>{let i=r.cart.items.find(c=>c.id===e.id),g;i?g={items:r.cart.items.map(c=>c.id===e.id?{...c,quantity:c.quantity+1}:c),total:r.cart.total+e.price}:g={items:[...r.cart.items,{id:e.id,name:e.name,price:e.price,quantity:1,image:e.image}],total:r.cart.total+e.price},b({cart:g}),window.openai?.sendMessage(`Added ${e.name} to cart ($${e.price})`)},v=()=>{window.openai?.sendMessage("Show my cart")},S=e=>e===0?{label:"Out of Stock",className:"stock-out"}:e<=5?{label:`Low (${e})`,className:"stock-low"}:{label:`In Stock (${e})`,className:"stock-in"},w=r.cart.items.reduce((e,i)=>e+i.quantity,0);return s("div",{className:`product-grid-container ${o}`,children:[t("style",{children:`
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
      `}),s("div",{className:"product-grid-header",children:[t("h1",{className:"product-grid-title",children:"Products"}),w>0&&s("div",{className:"cart-badge",onClick:v,children:["\u{1F6D2} Cart",t("span",{className:"cart-count",children:w})]})]}),t("div",{className:"search-bar",children:t("input",{type:"text",className:"search-input",placeholder:"Search products by name or SKU...",value:n,onChange:e=>u(e.target.value)})}),l.length===0?s("div",{className:"empty-state",children:[t("div",{className:"empty-icon",children:"\u{1F4E6}"}),t("h2",{children:"No products found"}),t("p",{children:"Try adjusting your search or filters"})]}):t("div",{className:"product-grid",children:l.map(e=>{let i=S(e.stock);return s("div",{className:"product-card",children:[t("img",{src:e.image||"https://via.placeholder.com/300x200?text=No+Image",alt:e.name,className:"product-image"}),s("div",{className:"product-info",children:[t("h3",{className:"product-name",children:e.name}),e.description&&t("p",{className:"product-description",children:e.description}),s("div",{className:"product-price",children:["$",e.price.toFixed(2)]}),t("span",{className:`stock-badge ${i.className}`,children:i.label}),t("button",{className:"add-to-cart-btn",onClick:()=>k(e),disabled:e.stock===0,children:e.stock>0?"Add to Cart":"Out of Stock"})]})]},e.id)})})]})}var x=document.getElementById("product-grid-root");x&&O.createRoot(x).render(t(P,{}));
//# sourceMappingURL=product-grid.js.map
