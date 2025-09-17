const { Op } = require("sequelize");
const Category = require("../models/Category");
const Product = require("../models/Product");

async function listCategoriesService() {
  const rows = await Category.findAll({ order: [["name", "ASC"]], raw: true });
  return rows;
}

async function listProductsByCategoryPagedService({ categoryId, page , limit }) {
  const where = { status: "active" };
  if (categoryId) where.categoryId = Number(categoryId);

  const offset = (Number(page) - 1) * Number(limit);
  const { rows, count } = await Product.findAndCountAll({
    where,
    order: [["id", "DESC"]],
    offset,
    limit: Number(limit),
    raw: true,
  });

  const totalPages = Math.ceil(count / Number(limit));
  return {
    items: rows,
    page: Number(page),
    limit: Number(limit),
    totalItems: count,
    totalPages,
  };
}

module.exports = {
  listCategoriesService,
  listProductsByCategoryPagedService,
};
