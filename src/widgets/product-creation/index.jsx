import React from "react";
import { createRoot } from "react-dom/client";
import { Package, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import "../shared/index.css";

function ProductCreationWidget() {
  // This will receive data from the MCP tool response
  const data = window.__WIDGET_DATA__ || {
    status: "success",
    product: {
      id: null,
      name: "Sample Product",
      sku: "PROD-001",
      price: 99.99,
      inventory: 100,
      category: "Electronics",
    },
  };

  const { status, product, error } = data;

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "error":
        return <XCircle className="h-6 w-6 text-red-600" />;
      case "pending":
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      default:
        return <Package className="h-6 w-6 text-blue-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "pending":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  return (
    <div className="antialiased w-full text-black px-4 pb-4 border border-black/10 rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
      <div className="max-w-full">
        {/* Header */}
        <div className="flex flex-row items-center gap-4 border-b border-black/5 py-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-600">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-base sm:text-xl font-medium">
              Product {status === "success" ? "Created" : "Creation"}
            </div>
            <div className="text-sm text-black/60">
              Supercommerce E-Commerce Platform
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`mt-4 p-4 rounded-xl border ${getStatusColor()}`}>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div className="flex-1">
              <div className="font-medium">
                {status === "success"
                  ? "Product successfully created"
                  : status === "error"
                  ? "Failed to create product"
                  : "Creating product..."}
              </div>
              {error && (
                <div className="text-sm text-red-700 mt-1">{error}</div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        {product && status === "success" && (
          <div className="mt-4 space-y-3">
            <div className="text-base font-medium text-black/80">
              Product Details
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-black/5 rounded-lg">
                <div className="text-xs text-black/60 mb-1">Product Name</div>
                <div className="font-medium text-sm">{product.name}</div>
              </div>

              <div className="p-3 bg-black/5 rounded-lg">
                <div className="text-xs text-black/60 mb-1">SKU</div>
                <div className="font-medium text-sm font-mono">
                  {product.sku}
                </div>
              </div>

              <div className="p-3 bg-black/5 rounded-lg">
                <div className="text-xs text-black/60 mb-1">Price</div>
                <div className="font-medium text-sm">
                  ${product.price?.toFixed(2) || "0.00"}
                </div>
              </div>

              <div className="p-3 bg-black/5 rounded-lg">
                <div className="text-xs text-black/60 mb-1">Inventory</div>
                <div className="font-medium text-sm">{product.inventory}</div>
              </div>

              {product.category && (
                <div className="p-3 bg-black/5 rounded-lg col-span-2">
                  <div className="text-xs text-black/60 mb-1">Category</div>
                  <div className="font-medium text-sm">{product.category}</div>
                </div>
              )}

              {product.id && (
                <div className="p-3 bg-black/5 rounded-lg col-span-2">
                  <div className="text-xs text-black/60 mb-1">Product ID</div>
                  <div className="font-medium text-sm font-mono">
                    {product.id}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {status === "success" && (
          <div className="mt-4 pt-4 border-t border-black/5">
            <button
              type="button"
              className="w-full cursor-pointer inline-flex items-center justify-center rounded-full bg-blue-600 text-white px-4 py-2.5 font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              View Product Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("product-creation-root");
if (rootElement) {
  createRoot(rootElement).render(<ProductCreationWidget />);
}
