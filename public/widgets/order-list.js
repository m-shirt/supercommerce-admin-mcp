import{useState as m,useEffect as N,useMemo as S}from"react";import k from"react-dom/client";import{useEffect as w,useState as y}from"react";function d(){let[a,c]=y(null);return w(()=>{typeof window<"u"&&window.openai&&c(window.openai)},[]),a}import{useState as $,useEffect as A}from"react";import{jsx as t,jsxs as r}from"react/jsx-runtime";function O(){let[a,c]=m(window.openai?.toolOutput);N(()=>{let e=setInterval(()=>{let n=window.openai?.toolOutput;n!==a&&c(n)},100);return()=>clearInterval(e)},[a]);let s=S(()=>{if(a?.result?.content?.[0]?.text)try{let e=JSON.parse(a.result.content[0].text);return e?.data?.orders||e?.orders||[]}catch(e){console.error("Failed to parse orders:",e)}if(a?.content?.[0]?.text)try{let e=JSON.parse(a.content[0].text);return e?.data?.orders||e?.orders||[]}catch(e){console.error("Failed to parse orders:",e)}return[]},[a]),g=d("displayMode"),[p,b]=m(""),[o,i]=m("all"),u=s.filter(e=>{let n=e.id.toLowerCase().includes(p.toLowerCase())||e.customer.toLowerCase().includes(p.toLowerCase()),x=o==="all"||e.status===o;return n&&x}),h=e=>{window.openai?.sendFollowUpMessage?.(`View order ${e}`)},v=e=>({pending:{bg:"#fef3c7",text:"#92400e"},processing:{bg:"#dbeafe",text:"#1e40af"},shipped:{bg:"#e0e7ff",text:"#4338ca"},delivered:{bg:"#d1fae5",text:"#065f46"},cancelled:{bg:"#fee2e2",text:"#991b1b"}})[e]||{bg:"#f3f4f6",text:"#1f2937"},l={all:s.length,pending:s.filter(e=>e.status==="pending").length,processing:s.filter(e=>e.status==="processing").length,shipped:s.filter(e=>e.status==="shipped").length,delivered:s.filter(e=>e.status==="delivered").length,cancelled:s.filter(e=>e.status==="cancelled").length};return s.length===0&&!a?r("div",{className:"order-list-container loading",children:[t("style",{children:`
          .order-list-container.loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        `}),r("div",{style:{textAlign:"center",color:"white"},children:[t("div",{className:"loading-spinner"}),t("h2",{children:"Loading Orders..."})]})]}):r("div",{className:`order-list-container ${g}`,children:[t("style",{children:`
        .order-list-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
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
      `}),r("div",{className:"order-header",children:[t("h1",{className:"order-title",children:"Orders"}),r("p",{className:"order-subtitle",children:[s.length," total orders"]})]}),r("div",{className:"filters",children:[t("div",{className:"search-bar",children:t("input",{type:"text",className:"search-input",placeholder:"Search by order ID or customer name...",value:p,onChange:e=>b(e.target.value)})}),r("div",{className:"status-filters",children:[r("button",{className:`filter-btn ${o==="all"?"active":""}`,onClick:()=>i("all"),children:["All Orders",t("span",{className:"filter-count",children:l.all})]}),r("button",{className:`filter-btn ${o==="pending"?"active":""}`,onClick:()=>i("pending"),children:["Pending",t("span",{className:"filter-count",children:l.pending})]}),r("button",{className:`filter-btn ${o==="processing"?"active":""}`,onClick:()=>i("processing"),children:["Processing",t("span",{className:"filter-count",children:l.processing})]}),r("button",{className:`filter-btn ${o==="shipped"?"active":""}`,onClick:()=>i("shipped"),children:["Shipped",t("span",{className:"filter-count",children:l.shipped})]}),r("button",{className:`filter-btn ${o==="delivered"?"active":""}`,onClick:()=>i("delivered"),children:["Delivered",t("span",{className:"filter-count",children:l.delivered})]}),r("button",{className:`filter-btn ${o==="cancelled"?"active":""}`,onClick:()=>i("cancelled"),children:["Cancelled",t("span",{className:"filter-count",children:l.cancelled})]})]})]}),u.length===0?r("div",{className:"empty-state",children:[t("div",{className:"empty-icon",children:"\u{1F4E6}"}),t("h2",{children:"No orders found"}),t("p",{children:"Try adjusting your search or filters"})]}):t("div",{className:"orders-grid",children:u.map(e=>{let n=v(e.status);return r("div",{className:"order-card",onClick:()=>h(e.id),children:[r("div",{className:"order-card-header",children:[t("h3",{className:"order-id",children:e.id}),t("span",{className:"order-status",style:{backgroundColor:n.bg,color:n.text},children:e.status})]}),r("div",{className:"order-info",children:[r("div",{className:"info-row",children:[t("span",{className:"info-label",children:"Customer"}),t("span",{className:"info-value",children:e.customer})]}),r("div",{className:"info-row",children:[t("span",{className:"info-label",children:"Items"}),t("span",{className:"info-value",children:e.items})]}),r("div",{className:"info-row",children:[t("span",{className:"info-label",children:"Date"}),t("span",{className:"info-value",children:e.date})]}),r("div",{className:"info-row",children:[t("span",{className:"info-label",children:"Total"}),r("span",{className:"order-total",children:["$",e.total.toFixed(2)]})]})]}),t("button",{className:"view-btn",children:"View Details"})]},e.id)})})]})}var f=document.getElementById("order-list-root");f&&k.createRoot(f).render(t(O,{}));
