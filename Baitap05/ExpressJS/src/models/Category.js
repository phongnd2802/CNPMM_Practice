const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Category = sequelize.define(
  "Category",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  },
  {
    tableName: "categories",
    timestamps: true,
    indexes: [{ fields: ["name"] }],
  }
);

module.exports = Category;
