"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../../lib/api";

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderComponent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/order/my`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Failed fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 1. Adaptive Defensive Loading State (Skeletons)
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        <div className="h-9 w-48 bg-slate-200 dark:bg-gray-800 rounded-md mb-8 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-slate-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900 space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 dark:bg-gray-800 rounded-sm animate-pulse" />
                <div className="h-3 w-20 bg-slate-100 dark:bg-gray-800 rounded-sm animate-pulse" />
              </div>
              <div className="h-6 w-24 bg-slate-200 dark:bg-gray-800 rounded-full animate-pulse" />
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-gray-800 flex justify-between items-center">
              <div className="h-4 w-16 bg-slate-200 dark:bg-gray-800 rounded-sm animate-pulse" />
              <div className="h-9 w-28 bg-slate-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Adaptive Empty State 
  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 border border-dashed border-slate-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 my-12 animate-in fade-in duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-slate-300 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">No orders found</h2>
        <p className="text-sm text-slate-400 mt-1 mb-6">You haven&apos;t placed any premium orders with us yet.</p>
        <Link href="/user/products" className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs active:scale-[0.98]">
          Start Shopping
        </Link>
      </div>
    );
  }

  // Pure Semantic Color Pill Map matching API configurations
  const statusColors: { [key: string]: string } = {
    DELIVERED: "bg-green-50 text-green-700 border-green-200/60 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
    SHIPPED: "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50",
    CANCELLED: "bg-red-50 text-red-700 border-red-200/60 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Order History</h1>

      {orders.map((order) => (
        /* STEP 4: Refined light border lines, ambient shadows, and float-up micro-interactions */
        <div
          key={order.id}
          className="border border-slate-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
        >
          {/* STEP 3: Premium split header row layout (Invoice-style Data Presentation) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-gray-800/60">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Order <span className="font-mono font-medium text-slate-400">#{order.id}</span>
              </h2>
              <p className="text-xs text-slate-400">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
              </p>
            </div>
            
            {/* STEP 3: Semantic Capsule Status Badges */}
            <span
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                statusColors[order.status.toUpperCase()] || "bg-slate-50 text-slate-600 border-slate-200 dark:bg-gray-800 dark:text-slate-300"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Context Summary row items footer */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Amount</p>
                <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Items Ordered</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  {order.items.length} {order.items.length === 1 ? "Product" : "Products"}
                </p>
              </div>
            </div>

            {/* STEP 4: Harmonized cohesive hover focus button styles */}
            <div>
              {/* FIXED STEP 2 ROUTING BUG: Navigates to absolute user layout directory path */}
              <Link
                href={`/user/order/${order.id}`}
                className="inline-flex items-center justify-center text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:bg-slate-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-all active:scale-[0.98]"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}