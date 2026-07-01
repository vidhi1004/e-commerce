"use client";

import { useEffect, useState } from "react";
import StatCard from "./statCard";
import {
  Package,
  FolderTree,
  ShoppingCart,
  CreditCard,
  Users,
  Star,
  IndianRupee,
  Truck,
  Clock3,
} from "lucide-react";
import { dashboardService } from "@/app/services/dashboard.service";
import { useRouter } from "next/navigation";
import OrderStatusChart from "./orderStatusCart";
import PaymentStatusChart from "./paymentStatusCard";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import { toast } from "sonner";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuthGuard();

  // useEffect(() => {

  //   const loadDashboard = async () => {
  //     const data = await dashboardService.getDashboardStats();
  //     setStats(data);
  //   };

  //   loadDashboard();
  // }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.error("Session missing or expired. Please log in.");
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadDashboard = async () => {
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    };

    loadDashboard();
  }, [isAuthenticated]);
  if (!stats) {
    return <h2>Loading...</h2>;
  }
  const orderStatusData = [
    {
      name: "Pending",
      value: stats.pendingOrders,
    },
    {
      name: "Confirmed",
      value: stats.confirmedOrders,
    },
    {
      name: "Delivered",
      value: stats.deliveredOrders,
    },
    {
      name: "Cancelled",
      value: stats.cancelledOrders,
    },
  ];

  const payemntStatusData = [
    {
      name: "Pending",
      value: stats.pendingPayments,
    },
    {
      name: "Success",
      value: stats.successPayments,
    },
    {
      name: "Failed",
      value: stats.failedPayments,
    },
  ];

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          onClick={() => {
            router.push("/admin/products");
          }}
          title="Products"
          value={stats.products}
          icon={Package}
        />

        <StatCard
          onClick={() => {
            router.push("/admin/category");
          }}
          title="Categories"
          value={stats.categories}
          icon={FolderTree}
        />

        <StatCard
          onClick={() => {
            router.push("/admin/orders");
          }}
          title="Orders"
          value={stats.orders}
          icon={ShoppingCart}
        />

        <StatCard
          onClick={() => {
            router.push("/admin/payments");
          }}
          title="Payments"
          value={stats.payments}
          icon={CreditCard}
        />

        {/* <StatCard title="Customers" value={stats.users} icon={Users} /> */}

        <StatCard title="Reviews" value={stats.reviews} icon={Star} />

        <StatCard
          title="Revenue"
          value={`₹${stats.revenue}`}
          icon={IndianRupee}
        />

        <StatCard
          title="Delivered"
          value={stats.deliveredOrders}
          icon={Truck}
        />

        <StatCard title="Pending" value={stats.pendingOrders} icon={Clock3} />

        <OrderStatusChart data={orderStatusData}></OrderStatusChart>
        <PaymentStatusChart data={payemntStatusData}></PaymentStatusChart>
      </div>
    </div>
  );
}
