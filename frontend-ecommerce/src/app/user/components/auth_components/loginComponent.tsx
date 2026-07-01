"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE_URL } from "../../../../../lib/api";
import { toast } from "sonner";
import Link from "next/link";
export function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Login successful");
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("auth-change"));
        router.push("/user");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="border border-gray-300 shadow-xl max-w-96 p-6 m-8 mx-auto rounded-lg ">
      <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email-input"
            className="text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email-input"
            className="border border-gray-300 text-sm rounded-md block w-full px-3 py-2.5 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="password-input"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password-input"
            className="border border-gray-300 text-sm rounded-md block w-full px-3 py-2.5 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full text-white bg-blue-900 hover:bg-blue-900/50 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-2.5 transition-colors cursor-pointer mt-2"
        >
          Login
        </button>
        <p className="text-center">
          Don't have Account ?{" "}
          <Link href="register/" className="text-blue-700">
            Register
          </Link>{" "}
        </p>
      </form>
    </div>
  );
}
