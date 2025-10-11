import{useState as u,useEffect as z}from"react";import U from"react-dom/client";import{useEffect as T,useState as O}from"react";function f(){let[d,b]=O(null);return T(()=>{typeof window<"u"&&window.openai&&b(window.openai)},[]),d}import{useState as R,useEffect as A}from"react";import{jsx as r,jsxs as a}from"react/jsx-runtime";function P(){let[d,b]=u(window.openai?.toolOutput);z(()=>{let o=setInterval(()=>{let e=window.openai?.toolOutput;e!==d&&b(e)},100);return()=>clearInterval(o)},[d]);let{categories:w,brands:y}=useMemo(()=>{let o={categories:[{id:1,name:"Electronics"},{id:2,name:"Clothing"},{id:3,name:"Books"}],brands:[{id:1,name:"Brand A"},{id:2,name:"Brand B"},{id:3,name:"Brand C"}]};if(d?.result?.content?.[0]?.text)try{let e=JSON.parse(d.result.content[0].text);e?.categories&&(o.categories=e.categories),e?.brands&&(o.brands=e.brands)}catch(e){console.error("Failed to parse product creation data:",e)}else if(d?.content?.[0]?.text)try{let e=JSON.parse(d.content[0].text);e?.categories&&(o.categories=e.categories),e?.brands&&(o.brands=e.brands)}catch(e){console.error("Failed to parse product creation data:",e)}return o},[d]),E=f("displayMode"),[t,N]=u({name:"",sku:"",price:"",stock:"",categoryId:"",brandId:"",description:"",imageUrl:""}),[i,g]=u({}),[n,v]=u({}),[k,x]=u(!1),h=(o,e)=>{switch(o){case"name":if(!e.trim())return"Product name is required";if(e.length<3)return"Name must be at least 3 characters";break;case"sku":if(!e.trim())return"SKU is required";if(!/^[A-Z0-9-]+$/.test(e))return"SKU must contain only uppercase letters, numbers, and hyphens";break;case"price":if(!e)return"Price is required";if(parseFloat(e)<=0)return"Price must be greater than 0";break;case"stock":if(!e)return"Stock is required";if(parseInt(e)<0)return"Stock cannot be negative";break;case"categoryId":if(!e)return"Category is required";break;case"brandId":if(!e)return"Brand is required";break}},C=()=>{let o={},e=!0;return Object.keys(t).forEach(s=>{if(["name","sku","price","stock","categoryId","brandId"].includes(s)){let c=h(s,t[s]);c&&(o[s]=c,e=!1)}}),g(o),e},m=o=>{let{name:e,value:s}=o.target;if(N(c=>({...c,[e]:s})),n[e]){let c=h(e,s);g(p=>({...p,[e]:c}))}},l=o=>{let{name:e,value:s}=o.target;v(p=>({...p,[e]:!0}));let c=h(e,s);g(p=>({...p,[e]:c}))},B=o=>{o.preventDefault();let e=Object.keys(t).reduce((c,p)=>({...c,[p]:!0}),{});if(v(e),!C())return;x(!0);let s={name:t.name,sku:t.sku,price:parseFloat(t.price),stock:parseInt(t.stock),categoryId:parseInt(t.categoryId),brandId:parseInt(t.brandId),description:t.description,imageUrl:t.imageUrl};window.openai?.sendFollowUpMessage?.(`Create new product: ${JSON.stringify(s,null,2)}`),setTimeout(()=>{x(!1),N({name:"",sku:"",price:"",stock:"",categoryId:"",brandId:"",description:"",imageUrl:""}),v({}),g({})},1e3)},I=w.find(o=>o.id===parseInt(t.categoryId)),S=y.find(o=>o.id===parseInt(t.brandId));return a("div",{className:`product-creation-container ${E}`,children:[r("style",{children:`
        .product-creation-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
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
      `}),a("div",{className:"creation-header",children:[r("h1",{className:"creation-title",children:"Create New Product"}),r("div",{className:"creation-subtitle",children:"Fill in the details below to add a new product"})]}),a("div",{className:"creation-content",children:[a("div",{className:"form-card",children:[r("h2",{className:"card-title",children:"Product Details"}),a("form",{onSubmit:B,children:[a("div",{className:"form-group",children:[a("label",{className:"form-label",children:["Product Name ",r("span",{className:"required",children:"*"})]}),r("input",{type:"text",name:"name",className:`form-input ${n.name&&i.name?"error":""}`,value:t.name,onChange:m,onBlur:l,placeholder:"Enter product name"}),n.name&&i.name&&r("div",{className:"error-message",children:i.name})]}),a("div",{className:"form-group",children:[a("label",{className:"form-label",children:["SKU ",r("span",{className:"required",children:"*"})]}),r("input",{type:"text",name:"sku",className:`form-input ${n.sku&&i.sku?"error":""}`,value:t.sku,onChange:m,onBlur:l,placeholder:"PROD-12345"}),n.sku&&i.sku&&r("div",{className:"error-message",children:i.sku})]}),a("div",{className:"form-grid",children:[a("div",{className:"form-group",children:[a("label",{className:"form-label",children:["Price ",r("span",{className:"required",children:"*"})]}),r("input",{type:"number",name:"price",className:`form-input ${n.price&&i.price?"error":""}`,value:t.price,onChange:m,onBlur:l,placeholder:"0.00",step:"0.01",min:"0"}),n.price&&i.price&&r("div",{className:"error-message",children:i.price})]}),a("div",{className:"form-group",children:[a("label",{className:"form-label",children:["Stock ",r("span",{className:"required",children:"*"})]}),r("input",{type:"number",name:"stock",className:`form-input ${n.stock&&i.stock?"error":""}`,value:t.stock,onChange:m,onBlur:l,placeholder:"0",min:"0"}),n.stock&&i.stock&&r("div",{className:"error-message",children:i.stock})]})]}),a("div",{className:"form-grid",children:[a("div",{className:"form-group",children:[a("label",{className:"form-label",children:["Category ",r("span",{className:"required",children:"*"})]}),a("select",{name:"categoryId",className:`form-select ${n.categoryId&&i.categoryId?"error":""}`,value:t.categoryId,onChange:m,onBlur:l,children:[r("option",{value:"",children:"Select category"}),w.map(o=>r("option",{value:o.id,children:o.name},o.id))]}),n.categoryId&&i.categoryId&&r("div",{className:"error-message",children:i.categoryId})]}),a("div",{className:"form-group",children:[a("label",{className:"form-label",children:["Brand ",r("span",{className:"required",children:"*"})]}),a("select",{name:"brandId",className:`form-select ${n.brandId&&i.brandId?"error":""}`,value:t.brandId,onChange:m,onBlur:l,children:[r("option",{value:"",children:"Select brand"}),y.map(o=>r("option",{value:o.id,children:o.name},o.id))]}),n.brandId&&i.brandId&&r("div",{className:"error-message",children:i.brandId})]})]}),a("div",{className:"form-group",children:[r("label",{className:"form-label",children:"Description"}),r("textarea",{name:"description",className:"form-textarea",value:t.description,onChange:m,onBlur:l,placeholder:"Enter product description"})]}),a("div",{className:"form-group",children:[r("label",{className:"form-label",children:"Image URL"}),r("input",{type:"url",name:"imageUrl",className:"form-input",value:t.imageUrl,onChange:m,onBlur:l,placeholder:"https://example.com/image.jpg"})]}),r("button",{type:"submit",className:"submit-btn",disabled:k,children:k?"Creating Product...":"Create Product"})]})]}),a("div",{className:"preview-card",children:[r("h2",{className:"card-title",children:"Preview"}),t.name||t.price||t.imageUrl?a("div",{className:"preview-product",children:[r("div",{className:"preview-image",children:t.imageUrl?r("img",{src:t.imageUrl,alt:t.name||"Product"}):r("span",{children:"\u{1F4E6}"})}),a("div",{className:"preview-info",children:[r("h3",{className:"preview-name",children:t.name||"Product Name"}),t.sku&&a("div",{className:"preview-sku",children:["SKU: ",t.sku]}),a("div",{className:"preview-badges",children:[I&&r("span",{className:"preview-badge",children:I.name}),S&&r("span",{className:"preview-badge",children:S.name})]}),t.price&&a("div",{className:"preview-price",children:["$",parseFloat(t.price).toFixed(2)]}),t.stock&&a("div",{className:"preview-stock",children:["In Stock: ",t.stock," units"]}),t.description&&r("div",{className:"preview-description",children:t.description})]})]}):a("div",{className:"empty-preview",children:[r("div",{className:"empty-icon",children:"\u{1F4E6}"}),r("div",{children:"Start filling the form to see preview"})]})]})]})]})}var F=document.getElementById("product-creation-root");F&&U.createRoot(F).render(r(P,{}));
