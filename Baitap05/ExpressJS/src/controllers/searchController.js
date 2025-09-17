// controllers/searchController.js
const { searchProductsES, bulkIndexAllProductsES } = require("../services/productSearchService");

async function searchProducts(req, res) {
  try {
    const data = await searchProductsES(req.query);
    return res.status(200).json({ EC: 0, EM: "OK", DT: data });
  } catch (e) {
    console.error("searchProducts error:", e);
    return res.status(500).json({ EC: -1, EM: "Server error", DT: null });
  }
}

async function reindexAllProducts(req, res) {
  try {
    const rs = await bulkIndexAllProductsES();
    return res.status(200).json({ EC: 0, EM: "Reindexed", DT: rs });
  } catch (e) {
    console.error("reindexAllProducts error:", e);
    return res.status(500).json({ EC: -1, EM: "Server error", DT: null });
  }
}

module.exports = { searchProducts, reindexAllProducts };
