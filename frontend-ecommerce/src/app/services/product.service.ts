import { api } from "./api";

export const productService = {
  getProducts() {
    return api.get("/catalog/products");
  },

  getProduct(id: number) {
    return api.get(`/catalog/products/${id}`);
  },

  createProduct(data: any) {
    return api.post("/catalog/products", data);
  },

  updateProduct(id: number, data: any) {
    return api.patch(`/catalog/products/${id}`, data);
  },

  deleteProduct(id: number) {
    return api.delete(`/catalog/products/${id}`);
  },
};