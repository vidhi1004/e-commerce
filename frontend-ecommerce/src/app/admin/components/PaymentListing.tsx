"use client";

import { useEffect, useState } from "react";
import PaymentTable from "./PaymentTable";
// import { Payment } from "@/app/components/Payment_component/PaymentComponent";
import { API_BASE_URL } from "../../../../lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";

export function PaymentComponent() {
  const [payments, setPayments] = useState<any[]>([]);
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
        const response = await fetch(`${API_BASE_URL}/payment`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        const data = await response.json();
        console.log(data.payments);
        if (response.ok) {
          setPayments(data.payments);
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

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <div>
          <PaymentTable payments={payments}></PaymentTable>
        </div>
      </div>
    );
  }
}
