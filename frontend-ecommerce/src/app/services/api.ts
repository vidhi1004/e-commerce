import { API_BASE_URL } from "../../../lib/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const api = {
  async get(url: string) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    return response.json();
  },

  async post(url: string, body: any) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(body),
    });

    return response.json();
  },

  async patch(url: string, body: any) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "PATCH",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(body),
    });

    return response.json();
  },

  async delete(url: string) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });

    return response.json();
  },
};
