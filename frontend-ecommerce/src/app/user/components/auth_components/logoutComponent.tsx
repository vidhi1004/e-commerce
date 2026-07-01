"use client";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../../../lib/api";
import { toast } from "sonner";
export function LogoutComponent() {
  const router = useRouter();

  const handleClick = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.removeItem("token");
      toast.success("Logout Successfull");
      router.push("/user/auth/login");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      <button
        type="submit"
        onClick={handleClick}
        className="bg-blue-700 text-white p-2 rounded-2xl transition-all duration-100 hover:bg-gray-400 "
      >
        Logout
      </button>
    </div>
  );
}
