"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL } from "../../../lib/api";

export function useAuthGuard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        handleUnauthenticated();
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          handleUnauthenticated();
        }
      } catch (error) {
        console.error("Session verification failed", error);
        setIsAuthenticated(false);
      }
    };

    const handleUnauthenticated = () => {
      setIsAuthenticated(false);
      toast.error("Please sign in to view your account, cart, or wishlist.");

      router.push("/user/auth/login");
    };

    checkSession();
  }, [router]);

  return { isAuthenticated };
}
