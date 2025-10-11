import{useState as f}from"react";import P from"react-dom/client";import{useEffect as T,useState as z}from"react";function g(){let[h,p]=z(null);return T(()=>{typeof window<"u"&&window.openai&&p(window.openai)},[]),h}import{useState as O,useEffect as R}from"react";import{jsx as e,jsxs as a}from"react/jsx-runtime";function U(){let p=window.openai?.toolInput||{},w=p?.categories||[{id:1,name:"Electronics"},{id:2,name:"Clothing"},{id:3,name:"Books"}],y=p?.brands||[{id:1,name:"Brand A"},{id:2,name:"Brand B"},{id:3,name:"Brand C"}],C=g("displayMode"),[r,k]=f({name:"",sku:"",price:"",stock:"",categoryId:"",brandId:"",description:"",imageUrl:""}),[i,u]=f({}),[n,b]=f({}),[N,I]=f(!1),v=(o,t)=>{switch(o){case"name":if(!t.trim())return"Product name is required";if(t.length<3)return"Name must be at least 3 characters";break;case"sku":if(!t.trim())return"SKU is required";if(!/^[A-Z0-9-]+$/.test(t))return"SKU must contain only uppercase letters, numbers, and hyphens";break;case"price":if(!t)return"Price is required";if(parseFloat(t)<=0)return"Price must be greater than 0";break;case"stock":if(!t)return"Stock is required";if(parseInt(t)<0)return"Stock cannot be negative";break;case"categoryId":if(!t)return"Category is required";break;case"brandId":if(!t)return"Brand is required";break}},B=()=>{let o={},t=!0;return Object.keys(r).forEach(s=>{if(["name","sku","price","stock","categoryId","brandId"].includes(s)){let c=v(s,r[s]);c&&(o[s]=c,t=!1)}}),u(o),t},d=o=>{let{name:t,value:s}=o.target;if(k(c=>({...c,[t]:s})),n[t]){let c=v(t,s);u(l=>({...l,[t]:c}))}},m=o=>{let{name:t,value:s}=o.target;b(l=>({...l,[t]:!0}));let c=v(t,s);u(l=>({...l,[t]:c}))},F=o=>{o.preventDefault();let t=Object.keys(r).reduce((c,l)=>({...c,[l]:!0}),{});if(b(t),!B())return;I(!0);let s={name:r.name,sku:r.sku,price:parseFloat(r.price),stock:parseInt(r.stock),categoryId:parseInt(r.categoryId),brandId:parseInt(r.brandId),description:r.description,imageUrl:r.imageUrl};window.openai?.sendMessage(`Create new product: ${JSON.stringify(s,null,2)}`),setTimeout(()=>{I(!1),k({name:"",sku:"",price:"",stock:"",categoryId:"",brandId:"",description:"",imageUrl:""}),b({}),u({})},1e3)},x=w.find(o=>o.id===parseInt(r.categoryId)),S=y.find(o=>o.id===parseInt(r.brandId));return a("div",{className:`product-creation-container ${C}`,children:[e("style",{children:`
        .product-creation-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .creation-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .creation-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
        }

        .creation-subtitle {
          color: white;
          font-size: 1rem;
          opacity: 0.9;
        }

        .creation-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .product-creation-container:not(.pip) .creation-content {
          grid-template-columns: 1fr 1fr;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .preview-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          height: fit-content;
          position: sticky;
          top: 1rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .required {
          color: #ef4444;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-input.error,
        .form-textarea.error,
        .form-select.error {
          border-color: #ef4444;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .submit-btn {
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
          margin-top: 1rem;
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .preview-product {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .preview-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          font-size: 3rem;
        }

        .preview-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-info {
          padding: 1.5rem;
        }

        .preview-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem;
          min-height: 1.5rem;
        }

        .preview-sku {
          font-family: monospace;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.75rem;
        }

        .preview-badges {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .preview-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          background: #f3f4f6;
          color: #6b7280;
        }

        .preview-price {
          font-size: 2rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .preview-stock {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .preview-description {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .empty-preview {
          text-align: center;
          padding: 3rem 1rem;
          color: #9ca3af;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .product-creation-container:not(.pip) .creation-content {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .preview-card {
            position: static;
          }
        }
      `}),a("div",{className:"creation-header",children:[e("h1",{className:"creation-title",children:"Create New Product"}),e("div",{className:"creation-subtitle",children:"Fill in the details below to add a new product"})]}),a("div",{className:"creation-content",children:[a("div",{className:"form-card",children:[e("h2",{className:"card-title",children:"Product Details"}),a("form",{onSubmit:F,children:[a("div",{className:"form-group",children:[a("label",{className:"form-label",children:["Product Name ",e("span",{className:"required",children:"*"})]}),e("input",{type:"text",name:"name",className:`form-input ${n.name&&i.name?"error":""}`,value:r.name,onChange:d,onBlur:m,placeholder:"Enter product name"}),n.name&&i.name&&e("div",{className:"error-message",children:i.name})]}),a("div",{className:"form-group",children:[a("label",{className:"form-label",children:["SKU ",e("span",{className:"required",children:"*"})]}),e("input",{type:"text",name:"sku",className:`form-input ${n.sku&&i.sku?"error":""}`,value:r.sku,onChange:d,onBlur:m,placeholder:"PROD-12345"}),n.sku&&i.sku&&e("div",{className:"error-message",children:i.sku})]}),a("div",{className:"form-grid",children:[a("div",{className:"form-group",children:[a("label",{className:"form-label",children:["Price ",e("span",{className:"required",children:"*"})]}),e("input",{type:"number",name:"price",className:`form-input ${n.price&&i.price?"error":""}`,value:r.price,onChange:d,onBlur:m,placeholder:"0.00",step:"0.01",min:"0"}),n.price&&i.price&&e("div",{className:"error-message",children:i.price})]}),a("div",{className:"form-group",children:[a("label",{className:"form-label",children:["Stock ",e("span",{className:"required",children:"*"})]}),e("input",{type:"number",name:"stock",className:`form-input ${n.stock&&i.stock?"error":""}`,value:r.stock,onChange:d,onBlur:m,placeholder:"0",min:"0"}),n.stock&&i.stock&&e("div",{className:"error-message",children:i.stock})]})]}),a("div",{className:"form-grid",children:[a("div",{className:"form-group",children:[a("label",{className:"form-label",children:["Category ",e("span",{className:"required",children:"*"})]}),a("select",{name:"categoryId",className:`form-select ${n.categoryId&&i.categoryId?"error":""}`,value:r.categoryId,onChange:d,onBlur:m,children:[e("option",{value:"",children:"Select category"}),w.map(o=>e("option",{value:o.id,children:o.name},o.id))]}),n.categoryId&&i.categoryId&&e("div",{className:"error-message",children:i.categoryId})]}),a("div",{className:"form-group",children:[a("label",{className:"form-label",children:["Brand ",e("span",{className:"required",children:"*"})]}),a("select",{name:"brandId",className:`form-select ${n.brandId&&i.brandId?"error":""}`,value:r.brandId,onChange:d,onBlur:m,children:[e("option",{value:"",children:"Select brand"}),y.map(o=>e("option",{value:o.id,children:o.name},o.id))]}),n.brandId&&i.brandId&&e("div",{className:"error-message",children:i.brandId})]})]}),a("div",{className:"form-group",children:[e("label",{className:"form-label",children:"Description"}),e("textarea",{name:"description",className:"form-textarea",value:r.description,onChange:d,onBlur:m,placeholder:"Enter product description"})]}),a("div",{className:"form-group",children:[e("label",{className:"form-label",children:"Image URL"}),e("input",{type:"url",name:"imageUrl",className:"form-input",value:r.imageUrl,onChange:d,onBlur:m,placeholder:"https://example.com/image.jpg"})]}),e("button",{type:"submit",className:"submit-btn",disabled:N,children:N?"Creating Product...":"Create Product"})]})]}),a("div",{className:"preview-card",children:[e("h2",{className:"card-title",children:"Preview"}),r.name||r.price||r.imageUrl?a("div",{className:"preview-product",children:[e("div",{className:"preview-image",children:r.imageUrl?e("img",{src:r.imageUrl,alt:r.name||"Product"}):e("span",{children:"\u{1F4E6}"})}),a("div",{className:"preview-info",children:[e("h3",{className:"preview-name",children:r.name||"Product Name"}),r.sku&&a("div",{className:"preview-sku",children:["SKU: ",r.sku]}),a("div",{className:"preview-badges",children:[x&&e("span",{className:"preview-badge",children:x.name}),S&&e("span",{className:"preview-badge",children:S.name})]}),r.price&&a("div",{className:"preview-price",children:["$",parseFloat(r.price).toFixed(2)]}),r.stock&&a("div",{className:"preview-stock",children:["In Stock: ",r.stock," units"]}),r.description&&e("div",{className:"preview-description",children:r.description})]})]}):a("div",{className:"empty-preview",children:[e("div",{className:"empty-icon",children:"\u{1F4E6}"}),e("div",{children:"Start filling the form to see preview"})]})]})]})]})}var E=document.getElementById("product-creation-root");E&&P.createRoot(E).render(e(U,{}));
//# sourceMappingURL=product-creation.js.map
