import{useState as f}from"react";import N from"react-dom/client";import{useEffect as x,useState as y}from"react";function d(){let[p,l]=y(null);return x(()=>{typeof window<"u"&&window.openai&&l(window.openai)},[]),p}import{useState as z,useEffect as T}from"react";import{jsx as t,jsxs as a}from"react/jsx-runtime";function S(){let l=window.openai?.toolInput||{},r=l?.data?.orders||l?.orders||[],g=d("displayMode"),[c,b]=f(""),[s,o]=f("all"),m=r.filter(e=>{let i=e.id.toLowerCase().includes(c.toLowerCase())||e.customer.toLowerCase().includes(c.toLowerCase()),w=s==="all"||e.status===s;return i&&w}),h=e=>{window.openai?.sendMessage(`View order ${e}`)},v=e=>({pending:{bg:"#fef3c7",text:"#92400e"},processing:{bg:"#dbeafe",text:"#1e40af"},shipped:{bg:"#e0e7ff",text:"#4338ca"},delivered:{bg:"#d1fae5",text:"#065f46"},cancelled:{bg:"#fee2e2",text:"#991b1b"}})[e]||{bg:"#f3f4f6",text:"#1f2937"},n={all:r.length,pending:r.filter(e=>e.status==="pending").length,processing:r.filter(e=>e.status==="processing").length,shipped:r.filter(e=>e.status==="shipped").length,delivered:r.filter(e=>e.status==="delivered").length,cancelled:r.filter(e=>e.status==="cancelled").length};return a("div",{className:`order-list-container ${g}`,children:[t("style",{children:`
        .order-list-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .order-header {
          margin-bottom: 1.5rem;
        }

        .order-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .order-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
        }

        .filters {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .search-bar {
          margin-bottom: 1rem;
        }

        .search-input {
          width: 50%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .status-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-btn:hover {
          border-color: #667eea;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .filter-count {
          background: rgba(0, 0, 0, 0.1);
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
        }

        .filter-btn.active .filter-count {
          background: rgba(255, 255, 255, 0.2);
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }

        .order-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .order-id {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .order-status {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .order-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .info-label {
          color: #6b7280;
        }

        .info-value {
          font-weight: 600;
          color: #1f2937;
        }

        .order-total {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }

        .view-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .view-btn:hover {
          opacity: 0.9;
        }

        .empty-state {
          background: white;
          border-radius: 12px;
          padding: 4rem 2rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h2 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .orders-grid {
            grid-template-columns: 1fr;
          }
        }
      `}),a("div",{className:"order-header",children:[t("h1",{className:"order-title",children:"Orders"}),a("p",{className:"order-subtitle",children:[r.length," total orders"]})]}),a("div",{className:"filters",children:[t("div",{className:"search-bar",children:t("input",{type:"text",className:"search-input",placeholder:"Search by order ID or customer name...",value:c,onChange:e=>b(e.target.value)})}),a("div",{className:"status-filters",children:[a("button",{className:`filter-btn ${s==="all"?"active":""}`,onClick:()=>o("all"),children:["All Orders",t("span",{className:"filter-count",children:n.all})]}),a("button",{className:`filter-btn ${s==="pending"?"active":""}`,onClick:()=>o("pending"),children:["Pending",t("span",{className:"filter-count",children:n.pending})]}),a("button",{className:`filter-btn ${s==="processing"?"active":""}`,onClick:()=>o("processing"),children:["Processing",t("span",{className:"filter-count",children:n.processing})]}),a("button",{className:`filter-btn ${s==="shipped"?"active":""}`,onClick:()=>o("shipped"),children:["Shipped",t("span",{className:"filter-count",children:n.shipped})]}),a("button",{className:`filter-btn ${s==="delivered"?"active":""}`,onClick:()=>o("delivered"),children:["Delivered",t("span",{className:"filter-count",children:n.delivered})]}),a("button",{className:`filter-btn ${s==="cancelled"?"active":""}`,onClick:()=>o("cancelled"),children:["Cancelled",t("span",{className:"filter-count",children:n.cancelled})]})]})]}),m.length===0?a("div",{className:"empty-state",children:[t("div",{className:"empty-icon",children:"\u{1F4E6}"}),t("h2",{children:"No orders found"}),t("p",{children:"Try adjusting your search or filters"})]}):t("div",{className:"orders-grid",children:m.map(e=>{let i=v(e.status);return a("div",{className:"order-card",onClick:()=>h(e.id),children:[a("div",{className:"order-card-header",children:[t("h3",{className:"order-id",children:e.id}),t("span",{className:"order-status",style:{backgroundColor:i.bg,color:i.text},children:e.status})]}),a("div",{className:"order-info",children:[a("div",{className:"info-row",children:[t("span",{className:"info-label",children:"Customer"}),t("span",{className:"info-value",children:e.customer})]}),a("div",{className:"info-row",children:[t("span",{className:"info-label",children:"Items"}),t("span",{className:"info-value",children:e.items})]}),a("div",{className:"info-row",children:[t("span",{className:"info-label",children:"Date"}),t("span",{className:"info-value",children:e.date})]}),a("div",{className:"info-row",children:[t("span",{className:"info-label",children:"Total"}),a("span",{className:"order-total",children:["$",e.total.toFixed(2)]})]})]}),t("button",{className:"view-btn",children:"View Details"})]},e.id)})})]})}var u=document.getElementById("order-list-root");u&&N.createRoot(u).render(t(S,{}));
//# sourceMappingURL=order-list.js.map
