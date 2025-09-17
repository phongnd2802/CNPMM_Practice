// backend/src/services/productSearchService.js
const es = require("../lib/es");
const { INDEX } = require("../search/productIndex");
const Product = require("../models/Product");

function toESDoc(p) {
  return {
    id: Number(p.id),
    name: p.name,
    price: Number(p.price || 0),
    imageUrl: p.imageUrl || "",
    categoryId: Number(p.categoryId),
    isPromoted: !!p.isPromoted,
    discountPercent: Number(p.discountPercent || 0),
    views: Number(p.views || 0),
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

async function indexProductES(product) {
  await es.index({
    index: INDEX,
    id: String(product.id),
    document: toESDoc(product),
    refresh: true,
  });
}

async function deleteProductES(id) {
  await es.delete({
    index: INDEX,
    id: String(id),
    ignore: [404],
    refresh: true,
  });
}

async function bulkIndexAllProductsES() {
  const rows = await Product.findAll({ raw: true });
  if (!rows.length) return { total: 0 };
  const ops = rows.flatMap((p) => [
    { index: { _index: INDEX, _id: String(p.id) } },
    toESDoc(p),
  ]);
  const rs = await es.bulk({ refresh: true, body: ops });
  return { total: rows.length, errors: rs.errors };
}

function buildSort(sort) {
  switch (String(sort || "relevance")) {
    case "price_asc": return [{ price: "asc" }];
    case "price_desc": return [{ price: "desc" }];
    case "views_desc": return [{ views: "desc" }];
    case "newest": return [{ createdAt: "desc" }];
    default: return ["_score", { createdAt: "desc" }];
  }
}

async function searchProductsES({
  q,
  categoryId,
  priceMin,
  priceMax,
  promoted,
  minViews,
  sort,
  page = 1,
  limit = 12,
}) {
  const must = [];
  const filter = [{ term: { status: "active" } }];

  if (q && String(q).trim()) {
    must.push({
      multi_match: {
        query: String(q).trim(),
        fields: ["name^3"],
        fuzziness: "AUTO",
        operator: "and",
      },
    });
  } else {
    must.push({ match_all: {} });
  }

  if (categoryId !== undefined && categoryId !== null && String(categoryId).length) {
    filter.push({ term: { categoryId: Number(categoryId) } });
  }

  // ✅ Chỉ lọc khi người dùng thực sự bật khuyến mãi
  const promotedOn =
    promoted === true ||
    promoted === "true" ||
    promoted === 1 ||
    promoted === "1";
  if (promotedOn) {
    filter.push({ term: { isPromoted: true } });
  }
  // Nếu không bật -> KHÔNG thêm filter -> trả cả promoted và non-promoted

  const priceRange = {};
  if (priceMin !== undefined && String(priceMin).length) priceRange.gte = Number(priceMin);
  if (priceMax !== undefined && String(priceMax).length) priceRange.lte = Number(priceMax);
  if (Object.keys(priceRange).length) filter.push({ range: { price: priceRange } });

  if (minViews !== undefined && String(minViews).length) {
    filter.push({ range: { views: { gte: Number(minViews) } } });
  }

  const from = (Number(page) - 1) * Number(limit);
  const body = {
    query: { bool: { must, filter } },
    sort: buildSort(sort),
    from,
    size: Number(limit),
  };

  const rs = await es.search({ index: INDEX, body });
  const items = rs.hits.hits.map((h) => ({ id: Number(h._id), ...h._source }));
  const totalItems = (rs.hits.total && rs.hits.total.value) || 0;
  const totalPages = Math.ceil(totalItems / Number(limit));

  return { items, page: Number(page), limit: Number(limit), totalItems, totalPages };
}

module.exports = {
  indexProductES,
  deleteProductES,
  bulkIndexAllProductsES,
  searchProductsES,
};
