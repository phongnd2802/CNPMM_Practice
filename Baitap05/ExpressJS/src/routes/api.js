// routes/api.js
const express = require("express");
const routerAPI = express.Router();

const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const {
  getCategories,
  getProductsPaged,
} = require("../controllers/productController");

const { searchProducts, reindexAllProducts } = require("../controllers/searchController");

const auth = require("../middleware/auth");
const delay = require("../middleware/delay");

/* ---------- Public ---------- */
routerAPI.get("/", (req, res) => res.status(200).json("Hello world api"));

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", forgotPassword);
routerAPI.post("/reset-password", resetPassword);

routerAPI.get("/categories", getCategories);
routerAPI.get("/products", getProductsPaged);

// 🔎 Fuzzy Search + Filters (Elasticsearch)
routerAPI.get("/search/products", searchProducts);

// (tuỳ chọn) reindex toàn bộ dữ liệu sang ES
routerAPI.post("/search/reindex", reindexAllProducts);

/* ---------- Protected ---------- */
routerAPI.use(auth);
routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI;
