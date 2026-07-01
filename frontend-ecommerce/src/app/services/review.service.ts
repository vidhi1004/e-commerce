import { api } from "./api";

export const reviewService = {
  getReviews() {
    return api.get("/review");
  },

  getReview(id: number) {
    return api.get(`/review/${id}`);
  },

  deleteReview(id: number) {
    return api.delete(`/review/${id}`);
  },
};
