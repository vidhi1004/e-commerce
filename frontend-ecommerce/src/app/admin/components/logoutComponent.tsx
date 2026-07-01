"use client";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../../lib/api";
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
      router.push("/admin/login");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      <button type="submit" onClick={handleClick}>
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.5 7.5L10.5 10.75M13.5 7.5L10.5 4.5M13.5 7.5L4 7.5M8 13.5H1.5L1.5 1.5L8 1.5"
            stroke="#767676"
          />
        </svg>
      </button>
    </div>
  );
}
