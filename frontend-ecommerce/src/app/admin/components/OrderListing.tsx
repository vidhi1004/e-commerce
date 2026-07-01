"use client";

import { useEffect, useState } from "react";
import OrderTable from "./OrderTable";
import { Order } from "@/app/user/components/order_component/OrderComponent";
import { API_BASE_URL } from "../../../../lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";

export function OrderListingComponent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated } = useAuthGuard();

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.error("Administrative session missing or expired. Please sign in.");
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/order`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setOrders(data.orders);
        } else {
          toast.error("something went wrong");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log(orders);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <div>
          <OrderTable orders={orders}></OrderTable>
        </div>
      </div>
    );
  }
}
