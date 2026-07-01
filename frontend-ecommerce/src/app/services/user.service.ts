import { api } from "./api";

export const userService = {
  getUsers() {
    return api.get("/auth/users");
  },
};
