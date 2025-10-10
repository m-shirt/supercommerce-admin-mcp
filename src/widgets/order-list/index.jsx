import React from "react";
import { createRoot } from "react-dom/client";
import { ShoppingCart, Package, Truck, CheckCircle, Clock } from "lucide-react";
import "../shared/index.css";

function OrderListWidget() {
  // This will receive data from the MCP tool response
  const data = window.__WIDGET_DATA__ || {
    orders: [
      {
        id: "ORD-001",
        customer: "John Doe",
        date: "2025-10-10",
        total: 299.99,
        status: "delivered",
        items: 3,
      },
      {
        id: "ORD-002",
        customer: "Jane Smith",
        date: "2025-10-09",
        total: 149.99,
        status: "pending",
        items: 2,
      },
      {
        id: "ORD-003",
        customer: "Bob Johnson",
        date: "2025-10-08",
        total: 499.99,
        status: "shipped",
        items: 5,
      },
    ],
    total: 3,
  };

  const { orders = [], total = 0 } = data;

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="antialiased w-full text-black px-4 pb-2 border border-black/10 rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
      <div className="max-w-full">
        {/* Header */}
        <div className="flex flex-row items-center gap-4 sm:gap-4 border-b border-black/5 py-4">
          <div className="w-16 sm:w-18 aspect-square rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <ShoppingCart className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="text-base sm:text-xl font-medium">
              Recent Orders
            </div>
            <div className="text-sm text-black/60">
              {total} {total === 1 ? "order" : "orders"} found
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="min-w-full text-sm flex flex-col">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="px-3 -mx-2 rounded-2xl hover:bg-black/5 transition-colors"
            >
              <div
                style={{
                  borderBottom:
                    index === orders.length - 1
                      ? "none"
                      : "1px solid rgba(0, 0, 0, 0.05)",
                }}
                className="flex w-full items-center gap-3 py-3"
              >
                {/* Order Icon */}
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>

                {/* Order Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium text-sm sm:text-base truncate">
                      {order.id}
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-black/60">
                    <span>{order.customer}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{order.date}</span>
                  </div>
                </div>

                {/* Order Amount and Items */}
                <div className="text-right">
                  <div className="font-semibold text-sm sm:text-base">
                    ${order.total.toFixed(2)}
                  </div>
                  <div className="text-xs text-black/60">
                    {order.items} {order.items === 1 ? "item" : "items"}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="py-8 text-center">
              <Package className="h-12 w-12 text-black/20 mx-auto mb-3" />
              <div className="text-black/60">No orders found</div>
            </div>
          )}
        </div>

        {/* View All Button */}
        {orders.length > 0 && (
          <div className="px-0 pt-3 pb-2">
            <button
              type="button"
              className="w-full cursor-pointer inline-flex items-center justify-center rounded-full bg-blue-600 text-white px-4 py-2.5 font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              View All Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("order-list-root");
if (rootElement) {
  createRoot(rootElement).render(<OrderListWidget />);
}
