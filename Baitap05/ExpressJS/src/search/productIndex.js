// search/productIndex.js
const es = require("../lib/es");
const INDEX = process.env.ES_INDEX || "products";

async function ensureProductIndex() {
  try {
    const exists = await es.indices.exists({ index: INDEX });
    if (!exists) {
      await es.indices.create({
        index: INDEX,
        settings: {
          analysis: {
            analyzer: {
              vi_simple: { type: "standard" } // đủ dùng cho demo
            }
          }
        },
        mappings: {
          properties: {
            id: { type: "integer" },
            name: { type: "text", analyzer: "vi_simple" },
            price: { type: "double" },
            imageUrl: { type: "keyword" },
            categoryId: { type: "integer" },
            isPromoted: { type: "boolean" },
            discountPercent: { type: "integer" },
            views: { type: "integer" },
            status: { type: "keyword" },
            createdAt: { type: "date" },
            updatedAt: { type: "date" },
          }
        }
      });
      console.log("[ES] Created index:", INDEX);
    }
  } catch (e) {
    // Trên Elastic Cloud, nếu API key chưa đủ quyền 'manage' index -> sẽ lỗi 403
    console.warn("[ES] ensureProductIndex skipped:", e.meta?.body?.error?.reason || e.message);
  }
}

module.exports = { ensureProductIndex, INDEX };
