"use client";

import { useEffect, useState } from "react";
import { CategoryInterface } from "@/app/user/interface/category.interface";
import CategoryTable from "./CategoryTable";
import { API_BASE_URL } from "../../../../lib/api";
import { toast } from "sonner";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import { useRouter } from "next/navigation";

export function CategoryComponent() {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthGuard();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.error("Administrative session missing or expired. Please sign in.");
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/catalog/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <CategoryTable categories={categories} onSuccess={fetchData} />;
}
