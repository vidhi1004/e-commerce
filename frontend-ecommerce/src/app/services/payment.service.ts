import { api } from "./api";

export const paymentService = {
  getPayments() {
    return api.get("/payment");
  },

  getPayment(id: number) {
    return api.get(`/payment/${id}`);
  },
};
