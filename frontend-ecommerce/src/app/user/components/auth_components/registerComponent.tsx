"use client";

import { useState } from "react";
import { API_BASE_URL } from "../../../../../lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RegisterComponent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      router.push("login/");
      toast.success("Registered successfully");
    } else {
      toast.error("something went wrong");
    }
  };

  return (
    <div className="border border-gray-300 shadow-xl max-w-96 p-6 m-4 mx-auto rounded-lg bg-white">
      <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
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
        <div>
          <label className="text-sm font-medium text-gray-700">FirstName</label>
          <input
            name="firstName"
            className="border border-gray-300 text-sm rounded-md block w-full px-3 py-2.5 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">LastName</label>
          <input
            name="lastName"
            className="border border-gray-300 text-sm rounded-md block w-full px-3 py-2.5 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-2.5 transition-colors cursor-pointer mt-2"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
