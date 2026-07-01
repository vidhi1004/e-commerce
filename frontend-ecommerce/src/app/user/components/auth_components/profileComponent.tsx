"use client";

import { useEffect, useState } from "react";
import { ProfileInterface } from "../../interface/profile.interface";
import { LogoutComponent } from "./logoutComponent";
import { API_BASE_URL } from "../../../../../lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ProfileComponent() {
  const [data, setData] = useState<ProfileInterface | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const FetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          router.push("/user/auth/login");
          toast.error("Please log in again");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user credentials");
      }
    };

    FetchData();
  }, [router]);

  if (!data) {
    return (
      <div className="flex items-start p-6 justify-center animate-in fade-in duration-300">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 p-8 w-full max-w-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-slate-200 dark:bg-gray-800 rounded-full animate-pulse mb-3" />
            <div className="h-6 w-24 bg-slate-200 dark:bg-gray-800 rounded-md animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-16 bg-slate-100 dark:bg-gray-800 rounded-sm animate-pulse" />
                <div className="h-5 w-32 bg-slate-200 dark:bg-gray-800 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-100 dark:border-gray-800">
            <div className="h-10 w-full bg-slate-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const userInitial = data.firstName
    ? data.firstName.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="flex items-start p-6 justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 p-8 w-full max-w-lg transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-black shadow-inner tracking-wider mb-3">
            {userInitial}
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Account Details
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6">
          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
              User Identity ID
            </label>
            <p className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-200">
              #{data.id}
            </p>
          </div>

          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
              Email Address
            </label>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-all">
              {data.email}
            </p>
          </div>

          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
              First Name
            </label>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {data.firstName}
            </p>
          </div>

          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
              Last Name
            </label>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {data.lastName}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-gray-800/60">
          <LogoutComponent />
        </div>
      </div>
    </div>
  );
}
