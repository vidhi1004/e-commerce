import { api } from "./api";

export const orderService = {
  getOrders() {
    return api.get("/order");
  },

  getOrder(id: number) {
    return api.get(`/order/${id}`);
  },

  updateOrder(id: number, data: any) {
    return api.patch(`/order/${id}`, data);
  },

  deleteOrder(id: number) {
    return api.delete(`/order/${id}`);
  },
};
