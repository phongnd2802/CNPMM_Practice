const {
  listCategoriesService,
  listProductsByCategoryPagedService,
  listProductsByCategoryCursorService,
} = require("../services/productService");

async function getCategories(req, res) {
  try {
    const cats = await listCategoriesService();
    return res.json({ EC: 0, EM: "OK", DT: cats });
  } catch (e) {
    console.error("getCategories error:", e);
    return res.status(500).json({ EC: -1, EM: "Server error", DT: null });
  }
}

async function getProductsPaged(req, res) {
  try {
    const { categoryId, page = 1, limit = 3 } = req.query || {};
    const data = await listProductsByCategoryPagedService({ categoryId, page, limit });
    return res.json({ EC: 0, EM: "OK", DT: data });
  } catch (e) {
    console.error("getProductsPaged error:", e);
    return res.status(500).json({ EC: -1, EM: "Server error", DT: null });
  }
}

module.exports = { getCategories, getProductsPaged };
