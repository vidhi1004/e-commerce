"use client";

import { useState } from "react";
import { API_BASE_URL } from "../../../../../lib/api";
import { toast } from "sonner";

interface AddReviewProps {
  orderId:number;
  productId: number;
}

export default function AddReviewComponent({ orderId,productId }: AddReviewProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        rating,
        comment,
        orderId
      }),
    });

    if (response.ok) {
      toast.success("Review Added Successfully");
      setRating(5);
      setComment("");
    } else {
      const error = await response.json();
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <label>Rating</label>

      <input
        type="number"
        min={1}
        max={5}
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border rounded-md p-2"
      />

      <label>Comment</label>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border rounded-md p-2"
        rows={4}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
      >
        Submit Review
      </button>
    </form>
  );
}
