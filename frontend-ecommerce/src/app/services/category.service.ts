import { api } from "./api";

export const categoryService = {
  getCategories() {
    return api.get("/catalog/categories");
  },

  createCategory(data: any) {
    return api.post("/catalog/categories", data);
  },

  updateCategory(id: number, data: any) {
    return api.patch(`/catalog/categories/${id}`, data);
  },

  deleteCategory(id: number) {
    return api.delete(`/catalog/categories/${id}`);
  },
};
