import axios from './axios.customize';

// Auth/User
export const createUserApi = (name, email, password) =>
  axios.post("/v1/api/register", { name, email, password });

export const loginApi = (email, password) =>
  axios.post("/v1/api/login", { email, password });

export const getUserApi = () => axios.get("/v1/api/user");

// Password reset
export const forgotPasswordApi = (email) =>
  axios.post("/v1/api/forgot-password", { email });

export const resetPasswordApi = (email, token, newPassword) =>
  axios.post("/v1/api/reset-password", { email, token, newPassword });

// Catalog
export const getCategoriesApi = () => axios.get("/v1/api/categories");

// Products (paged)
export const getProductsPagedApi = (categoryId, page = 1, limit = 12) => {
  const params = new URLSearchParams();
  if (categoryId) params.set("categoryId", categoryId);
  params.set("page", page);
  params.set("limit", limit);
  return axios.get(`/v1/api/products?${params.toString()}`);
};

// Fuzzy search + filters (Elasticsearch)
export const searchProductsApi = (params = {}) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length) sp.set(k, v);
  });
  return axios.get(`/v1/api/search/products?${sp.toString()}`);
};
