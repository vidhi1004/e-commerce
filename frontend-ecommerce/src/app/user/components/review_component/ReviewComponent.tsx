"use client";

import { ReviewInterface } from "@/app/user/interface/review.interface";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../../lib/api";
import { toast } from "sonner";
interface ReviewProps {
  productId: number;
}

export default function ReviewComponent({ productId }: ReviewProps) {
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${API_BASE_URL}/review/product/${productId} `,
        {
          method: "GET",
          headers: {
            "Content-Type": "authorization/json",
          },
          credentials: "include",
        },
      );
      const data = await response.json();
      if (response.ok) {
        setReviews(data.reviews);
      } else {
      }
    };
    fetchData();
  }, []);
  if (!reviews) {
    return "No Reviews Found";
  } else {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <h4 className="font-semibold">Anonymous</h4>

                <span>⭐ {review.rating}/5</span>
              </div>

              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
