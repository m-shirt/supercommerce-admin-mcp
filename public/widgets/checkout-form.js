import{useState as b,useEffect as $,useMemo as q}from"react";import A from"react-dom/client";import{useEffect as F,useState as T}from"react";function u(){let[n,p]=T(null);return F(()=>{typeof window<"u"&&window.openai&&p(window.openai)},[]),n}import{useState as D,useEffect as G}from"react";import{jsx as t,jsxs as o}from"react/jsx-runtime";function P(){let[n,p]=b(window.openai?.toolOutput);$(()=>{let e=setInterval(()=>{let a=window.openai?.toolOutput;a!==n&&p(a)},100);return()=>clearInterval(e)},[n]);let{cartItems:f,customers:g,paymentMethods:v,cities:N,subtotal:d}=q(()=>{let e={cartItems:[],customers:[],paymentMethods:[],cities:[],subtotal:0};if(n?.result?.content?.[0]?.text)try{let a=JSON.parse(n.result.content[0].text);e={cartItems:a?.cartItems||[],customers:a?.customers||[],paymentMethods:a?.paymentMethods||[],cities:a?.cities||[],subtotal:a?.subtotal||0}}catch(a){console.error("Failed to parse checkout data:",a)}else if(n?.content?.[0]?.text)try{let a=JSON.parse(n.content[0].text);e={cartItems:a?.cartItems||[],customers:a?.customers||[],paymentMethods:a?.paymentMethods||[],cities:a?.cities||[],subtotal:a?.subtotal||0}}catch(a){console.error("Failed to parse checkout data:",a)}return!e.subtotal&&e.cartItems.length>0&&(e.subtotal=e.cartItems.reduce((a,m)=>a+m.price*m.quantity,0)),e},[n]),k=u("displayMode"),[r,M]=b({customerId:"",address:"",cityId:"",phone:"",paymentMethodId:"",notes:""}),[s,w]=b({}),i=e=>{let{name:a,value:m}=e.target;M(l=>({...l,[a]:m})),s[a]&&w(l=>({...l,[a]:""}))},C=()=>{let e={};return r.customerId||(e.customerId="Please select a customer"),r.address.trim()||(e.address="Address is required"),r.cityId||(e.cityId="Please select a city"),r.phone.trim()||(e.phone="Phone number is required"),r.paymentMethodId||(e.paymentMethodId="Please select a payment method"),w(e),Object.keys(e).length===0},x=e=>{if(e.preventDefault(),!C())return;let a=g.find(c=>c.id.toString()===r.customerId),m=N.find(c=>c.id.toString()===r.cityId),l=v.find(c=>c.id.toString()===r.paymentMethodId),O={customer:a?.name,address:r.address,city:m?.name,phone:r.phone,paymentMethod:l?.name,notes:r.notes,total:(d+y+h).toFixed(2)};window.openai?.sendFollowUpMessage?.(`Create order: ${JSON.stringify(O)}`)},y=d*.1,h=15,I=d+y+h;return o("div",{className:`checkout-container ${k}`,children:[t("style",{children:`
        .checkout-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
        }

        .checkout-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
        }

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .checkout-container:not(.pip) .checkout-content {
          grid-template-columns: 1.5fr 1fr;
        }

        .checkout-form {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-label.required::after {
          content: ' *';
          color: #ef4444;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-input.error,
        .form-select.error,
        .form-textarea.error {
          border-color: #ef4444;
        }

        .form-error {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .order-summary {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          height: fit-content;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 1rem;
        }

        .summary-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .summary-items {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .summary-row:last-of-type {
          border-bottom: none;
          padding-top: 1rem;
          margin-top: 0.5rem;
          border-top: 2px solid #e5e7eb;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .summary-label {
          color: #6b7280;
        }

        .summary-value {
          font-weight: 600;
          color: #1f2937;
        }

        .summary-row:last-of-type .summary-label,
        .summary-row:last-of-type .summary-value {
          color: #667eea;
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
        }

        .submit-btn:hover {
          opacity: 0.9;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .checkout-container:not(.pip) .checkout-content {
            grid-template-columns: 1fr;
          }
        }
      `}),t("h1",{className:"checkout-title",children:"Checkout"}),o("div",{className:"checkout-content",children:[o("form",{className:"checkout-form",onSubmit:x,children:[o("div",{className:"form-section",children:[t("h2",{className:"section-title",children:"Customer Information"}),o("div",{className:"form-group",children:[t("label",{className:"form-label required",children:"Customer"}),o("select",{name:"customerId",value:r.customerId,onChange:i,className:`form-select ${s.customerId?"error":""}`,children:[t("option",{value:"",children:"Select a customer"}),g.map(e=>o("option",{value:e.id,children:[e.name," - ",e.email]},e.id))]}),s.customerId&&t("div",{className:"form-error",children:s.customerId})]})]}),o("div",{className:"form-section",children:[t("h2",{className:"section-title",children:"Delivery Address"}),o("div",{className:"form-group",children:[t("label",{className:"form-label required",children:"Street Address"}),t("input",{type:"text",name:"address",value:r.address,onChange:i,className:`form-input ${s.address?"error":""}`,placeholder:"123 Main St, Apt 4B"}),s.address&&t("div",{className:"form-error",children:s.address})]}),o("div",{className:"form-group",children:[t("label",{className:"form-label required",children:"City"}),o("select",{name:"cityId",value:r.cityId,onChange:i,className:`form-select ${s.cityId?"error":""}`,children:[t("option",{value:"",children:"Select a city"}),N.map(e=>t("option",{value:e.id,children:e.name},e.id))]}),s.cityId&&t("div",{className:"form-error",children:s.cityId})]}),o("div",{className:"form-group",children:[t("label",{className:"form-label required",children:"Phone Number"}),t("input",{type:"tel",name:"phone",value:r.phone,onChange:i,className:`form-input ${s.phone?"error":""}`,placeholder:"+1 (555) 123-4567"}),s.phone&&t("div",{className:"form-error",children:s.phone})]})]}),o("div",{className:"form-section",children:[t("h2",{className:"section-title",children:"Payment Method"}),o("div",{className:"form-group",children:[t("label",{className:"form-label required",children:"Payment Method"}),o("select",{name:"paymentMethodId",value:r.paymentMethodId,onChange:i,className:`form-select ${s.paymentMethodId?"error":""}`,children:[t("option",{value:"",children:"Select payment method"}),v.map(e=>t("option",{value:e.id,children:e.name},e.id))]}),s.paymentMethodId&&t("div",{className:"form-error",children:s.paymentMethodId})]})]}),o("div",{className:"form-section",children:[t("h2",{className:"section-title",children:"Additional Notes"}),o("div",{className:"form-group",children:[t("label",{className:"form-label",children:"Order Notes (Optional)"}),t("textarea",{name:"notes",value:r.notes,onChange:i,className:"form-textarea",placeholder:"Any special instructions for delivery..."})]})]})]}),o("div",{className:"order-summary",children:[t("h2",{className:"summary-title",children:"Order Summary"}),f.length>0&&t("div",{className:"summary-items",children:f.map(e=>o("div",{className:"summary-item",children:[o("span",{children:[e.name," x",e.quantity]}),o("span",{children:["$",(e.price*e.quantity).toFixed(2)]})]},e.id))}),o("div",{className:"summary-row",children:[t("span",{className:"summary-label",children:"Subtotal"}),o("span",{className:"summary-value",children:["$",d.toFixed(2)]})]}),o("div",{className:"summary-row",children:[t("span",{className:"summary-label",children:"Tax (10%)"}),o("span",{className:"summary-value",children:["$",y.toFixed(2)]})]}),o("div",{className:"summary-row",children:[t("span",{className:"summary-label",children:"Shipping"}),o("span",{className:"summary-value",children:["$",h.toFixed(2)]})]}),o("div",{className:"summary-row",children:[t("span",{className:"summary-label",children:"Total"}),o("span",{className:"summary-value",children:["$",I.toFixed(2)]})]}),o("button",{type:"submit",className:"submit-btn",onClick:x,disabled:f.length===0,children:["Place Order $",I.toFixed(2)]})]})]})]})}var S=document.getElementById("checkout-form-root");S&&A.createRoot(S).render(t(P,{}));
