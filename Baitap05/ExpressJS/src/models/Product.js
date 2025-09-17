// models/Product.js
"use strict";

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Category = require("./Category");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(180), allowNull: false },
    isPromoted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    discountPercent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 100 },
    },
    views: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    imageUrl: { type: DataTypes.STRING(500), allowNull: true },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "products",
    timestamps: true,
    indexes: [
      { fields: ["categoryId"] },
      { fields: ["status"] },
      { fields: ["createdAt"] },
      { fields: ["price"] },
      { fields: ["views"] },
    ],
  }
);

// Associations
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });

module.exports = Product;
