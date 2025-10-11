import{useState as N}from"react";import w from"react-dom/client";import{useEffect as y,useState as x}from"react";function d(){let[m,n]=x(null);return y(()=>{typeof window<"u"&&window.openai&&n(window.openai)},[]),m}import{useState as A,useEffect as I}from"react";import{Fragment as g,jsx as e,jsxs as t}from"react/jsx-runtime";function k(){let n=window.openai?.toolInput||{},i=n?.order||n||{id:"12345",orderNumber:"ORD-12345",status:"processing",items:[],customer:{name:"Customer",email:"customer@example.com"},deliveryAddress:{street:"",city:"",state:"",zip:""},paymentMethod:"Credit Card",subtotal:0,tax:0,shipping:0,total:0},f=d("displayMode"),[s,b]=N(i.status),c=[{key:"pending",label:"Order Placed",icon:"\u{1F4DD}"},{key:"processing",label:"Processing",icon:"\u2699\uFE0F"},{key:"shipped",label:"Shipped",icon:"\u{1F69A}"},{key:"delivered",label:"Delivered",icon:"\u2705"}],l=["pending","processing","shipped","delivered"],o=l.indexOf(s),v=()=>{let a=Math.min(o+1,l.length-1),r=l[a];b(r),window.openai?.sendMessage(`Updated order ${i.orderNumber||i.id} status to: ${r}`)},p=a=>{switch(a){case"pending":return"#f59e0b";case"processing":return"#3b82f6";case"shipped":return"#8b5cf6";case"delivered":return"#10b981";case"cancelled":return"#ef4444";default:return"#6b7280"}};return t("div",{className:`order-status-container ${f}`,children:[e("style",{children:`
        .order-status-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .status-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .status-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
        }

        .order-number {
          color: white;
          font-size: 1.125rem;
          opacity: 0.9;
        }

        .status-timeline {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .timeline-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-bottom: 1rem;
        }

        .timeline-line {
          position: absolute;
          top: 30px;
          left: 0;
          right: 0;
          height: 4px;
          background: #e5e7eb;
          z-index: 0;
        }

        .timeline-progress {
          position: absolute;
          top: 30px;
          left: 0;
          height: 4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.5s ease;
          z-index: 1;
        }

        .timeline-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .step-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: #e5e7eb;
          border: 4px solid white;
          transition: all 0.3s;
          margin-bottom: 0.75rem;
        }

        .timeline-step.active .step-icon,
        .timeline-step.completed .step-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: scale(1.1);
        }

        .step-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          text-align: center;
        }

        .timeline-step.active .step-label,
        .timeline-step.completed .step-label {
          color: #667eea;
        }

        .order-details {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .order-status-container:not(.pip) .order-details {
          grid-template-columns: 2fr 1fr;
        }

        .details-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .order-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-item {
          display: flex;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .order-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .item-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          background: #f3f4f6;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .item-quantity {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .item-price {
          font-weight: 600;
          color: #667eea;
          text-align: right;
        }

        .info-section {
          margin-bottom: 1.5rem;
        }

        .info-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 0.875rem;
        }

        .info-label {
          color: #6b7280;
        }

        .info-value {
          color: #1f2937;
          font-weight: 600;
        }

        .info-text {
          font-size: 0.875rem;
          color: #1f2937;
          line-height: 1.5;
        }

        .status-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
          border-top: 2px solid #e5e7eb;
          margin-top: 0.5rem;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .total-label {
          color: #667eea;
        }

        .total-value {
          color: #667eea;
        }

        .update-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
          transition: opacity 0.2s;
        }

        .update-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .update-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .tracking-info {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .tracking-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .tracking-number {
          font-family: monospace;
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        @media (max-width: 768px) {
          .order-status-container:not(.pip) .order-details {
            grid-template-columns: 1fr;
          }

          .status-title {
            font-size: 1.5rem;
          }

          .timeline-steps {
            flex-wrap: wrap;
          }

          .step-icon {
            width: 50px;
            height: 50px;
            font-size: 1.25rem;
          }
        }
      `}),t("div",{className:"status-header",children:[e("h1",{className:"status-title",children:"Order Status"}),t("div",{className:"order-number",children:["Order #",i.orderNumber||i.id]})]}),e("div",{className:"status-timeline",children:t("div",{className:"timeline-steps",children:[e("div",{className:"timeline-line"}),e("div",{className:"timeline-progress",style:{width:`${o/(c.length-1)*100}%`}}),c.map((a,r)=>{let h=r<o?"completed":r===o?"active":"pending";return t("div",{className:`timeline-step ${h}`,children:[e("div",{className:"step-icon",children:a.icon}),e("div",{className:"step-label",children:a.label})]},a.key)})]})}),t("div",{className:"order-details",children:[t("div",{className:"details-card",children:[e("h2",{className:"card-title",children:"Order Items"}),e("div",{className:"order-items",children:i.items.map(a=>t("div",{className:"order-item",children:[e("img",{src:a.image||"https://via.placeholder.com/60?text=Item",alt:a.name,className:"item-image"}),t("div",{className:"item-info",children:[e("div",{className:"item-name",children:a.name}),t("div",{className:"item-quantity",children:["Qty: ",a.quantity]})]}),t("div",{className:"item-price",children:["$",(a.price*a.quantity).toFixed(2)]})]},a.id))})]}),t("div",{children:[t("div",{className:"details-card",children:[e("h2",{className:"card-title",children:"Customer Info"}),e("div",{className:"info-section",children:t("div",{className:"info-text",children:[e("strong",{children:i.customer.name}),e("br",{}),i.customer.email,e("br",{}),i.customer.phone&&e(g,{children:i.customer.phone})]})}),t("div",{className:"info-section",children:[e("div",{className:"section-title",children:"Delivery Address"}),t("div",{className:"info-text",children:[i.deliveryAddress.street,e("br",{}),i.deliveryAddress.city,", ",i.deliveryAddress.state," ",i.deliveryAddress.zip,i.deliveryAddress.country&&t(g,{children:[e("br",{}),i.deliveryAddress.country]})]})]}),t("div",{className:"info-section",children:[e("div",{className:"section-title",children:"Payment Method"}),e("div",{className:"info-text",children:i.paymentMethod})]}),t("div",{className:"info-section",children:[e("div",{className:"section-title",children:"Current Status"}),e("span",{className:"status-badge",style:{backgroundColor:p(s)+"20",color:p(s)},children:s})]}),i.trackingNumber&&t("div",{className:"tracking-info",children:[e("div",{className:"tracking-label",children:"Tracking Number"}),e("div",{className:"tracking-number",children:i.trackingNumber})]})]}),t("div",{className:"details-card",style:{marginTop:"1.5rem"},children:[e("h2",{className:"card-title",children:"Order Summary"}),t("div",{className:"info-row",children:[e("span",{className:"info-label",children:"Subtotal"}),t("span",{className:"info-value",children:["$",i.subtotal.toFixed(2)]})]}),t("div",{className:"info-row",children:[e("span",{className:"info-label",children:"Tax"}),t("span",{className:"info-value",children:["$",i.tax.toFixed(2)]})]}),t("div",{className:"info-row",children:[e("span",{className:"info-label",children:"Shipping"}),t("span",{className:"info-value",children:["$",i.shipping.toFixed(2)]})]}),t("div",{className:"total-row",children:[e("span",{className:"total-label",children:"Total"}),t("span",{className:"total-value",children:["$",i.total.toFixed(2)]})]}),e("button",{className:"update-btn",onClick:v,disabled:s==="delivered",children:s==="delivered"?"Order Delivered":"Update Status"})]})]})]})]})}var u=document.getElementById("order-status-root");u&&w.createRoot(u).render(e(k,{}));
