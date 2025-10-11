import{useState as I}from"react";import $ from"react-dom/client";import{useEffect as P,useState as T}from"react";function p(){let[b,n]=T(null);return P(()=>{typeof window<"u"&&window.openai&&n(window.openai)},[]),b}import{useState as E,useEffect as R}from"react";import{jsx as t,jsxs as o}from"react/jsx-runtime";function q(){let n=window.openai?.toolInput||{},d=n?.cartItems||[],h=n?.customers||[],g=n?.paymentMethods||[],v=n?.cities||[],c=n?.subtotal||d.reduce((e,s)=>e+s.price*s.quantity,0),k=p("displayMode"),[a,M]=I({customerId:"",address:"",cityId:"",phone:"",paymentMethodId:"",notes:""}),[r,N]=I({}),i=e=>{let{name:s,value:y}=e.target;M(m=>({...m,[s]:y})),r[s]&&N(m=>({...m,[s]:""}))},C=()=>{let e={};return a.customerId||(e.customerId="Please select a customer"),a.address.trim()||(e.address="Address is required"),a.cityId||(e.cityId="Please select a city"),a.phone.trim()||(e.phone="Phone number is required"),a.paymentMethodId||(e.paymentMethodId="Please select a payment method"),N(e),Object.keys(e).length===0},w=e=>{if(e.preventDefault(),!C())return;let s=h.find(l=>l.id.toString()===a.customerId),y=v.find(l=>l.id.toString()===a.cityId),m=g.find(l=>l.id.toString()===a.paymentMethodId),O={customer:s?.name,address:a.address,city:y?.name,phone:a.phone,paymentMethod:m?.name,notes:a.notes,total:(c+u+f).toFixed(2)};window.openai?.sendMessage(`Create order: ${JSON.stringify(O)}`)},u=c*.1,f=15,x=c+u+f;return o("div",{className:`checkout-container ${k}`,children:[t("style",{children:`
        .checkout-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
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
      `}),t("h1",{className:"checkout-title",children:"Checkout"}),o("div",{className:"checkout-content",children:[o("form",{className:"checkout-form",onSubmit:w,children:[o("div",{className:"form-section",children:[t("h2",{className:"section-title",children:"Customer Information"}),o("div",{className:"form-group",children:[t("label",{className:"form-label required",children:"Customer"}),o("select",{name:"customerId",value:a.customerId,onChange:i,className:`form-select ${r.customerId?"error":""}`,children:[t("option",{value:"",children:"Select a customer"}),h.map(e=>o("option",{value:e.id,children:[e.name," - ",e.email]},e.id))]}),r.customerId&&t("div",{className:"form-error",children:r.customerId})]})]}),o("div",{className:"form-section",children:[t("h2",{className:"section-title",children:"Delivery Address"}),o("div",{className:"form-group",children:[t("label",{className:"form-label required",children:"Street Address"}),t("input",{type:"text",name:"address",value:a.address,onChange:i,className:`form-input ${r.address?"error":""}`,placeholder:"123 Main St, Apt 4B"}),r.address&&t("div",{className:"form-error",children:r.address})]}),o("div",{className:"form-group",children:[t("label",{className:"form-label required",children:"City"}),o("select",{name:"cityId",value:a.cityId,onChange:i,className:`form-select ${r.cityId?"error":""}`,children:[t("option",{value:"",children:"Select a city"}),v.map(e=>t("option",{value:e.id,children:e.name},e.id))]}),r.cityId&&t("div",{className:"form-error",children:r.cityId})]}),o("div",{className:"form-group",children:[t("label",{className:"form-label required",children:"Phone Number"}),t("input",{type:"tel",name:"phone",value:a.phone,onChange:i,className:`form-input ${r.phone?"error":""}`,placeholder:"+1 (555) 123-4567"}),r.phone&&t("div",{className:"form-error",children:r.phone})]})]}),o("div",{className:"form-section",children:[t("h2",{className:"section-title",children:"Payment Method"}),o("div",{className:"form-group",children:[t("label",{className:"form-label required",children:"Payment Method"}),o("select",{name:"paymentMethodId",value:a.paymentMethodId,onChange:i,className:`form-select ${r.paymentMethodId?"error":""}`,children:[t("option",{value:"",children:"Select payment method"}),g.map(e=>t("option",{value:e.id,children:e.name},e.id))]}),r.paymentMethodId&&t("div",{className:"form-error",children:r.paymentMethodId})]})]}),o("div",{className:"form-section",children:[t("h2",{className:"section-title",children:"Additional Notes"}),o("div",{className:"form-group",children:[t("label",{className:"form-label",children:"Order Notes (Optional)"}),t("textarea",{name:"notes",value:a.notes,onChange:i,className:"form-textarea",placeholder:"Any special instructions for delivery..."})]})]})]}),o("div",{className:"order-summary",children:[t("h2",{className:"summary-title",children:"Order Summary"}),d.length>0&&t("div",{className:"summary-items",children:d.map(e=>o("div",{className:"summary-item",children:[o("span",{children:[e.name," x",e.quantity]}),o("span",{children:["$",(e.price*e.quantity).toFixed(2)]})]},e.id))}),o("div",{className:"summary-row",children:[t("span",{className:"summary-label",children:"Subtotal"}),o("span",{className:"summary-value",children:["$",c.toFixed(2)]})]}),o("div",{className:"summary-row",children:[t("span",{className:"summary-label",children:"Tax (10%)"}),o("span",{className:"summary-value",children:["$",u.toFixed(2)]})]}),o("div",{className:"summary-row",children:[t("span",{className:"summary-label",children:"Shipping"}),o("span",{className:"summary-value",children:["$",f.toFixed(2)]})]}),o("div",{className:"summary-row",children:[t("span",{className:"summary-label",children:"Total"}),o("span",{className:"summary-value",children:["$",x.toFixed(2)]})]}),o("button",{type:"submit",className:"submit-btn",onClick:w,disabled:d.length===0,children:["Place Order $",x.toFixed(2)]})]})]})]})}var S=document.getElementById("checkout-form-root");S&&$.createRoot(S).render(t(q,{}));
