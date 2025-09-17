const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});

async function ensureDatabase() {
  const conn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    multipleStatements: true,
  });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` 
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await conn.end();
}

async function connectDB() {
  await ensureDatabase();           // 1) tạo DB nếu chưa có
  await sequelize.authenticate();   // 2) test kết nối
  await sequelize.sync();           // 3) tạo tables theo models (dev)
  // hoặc dùng: await sequelize.sync({ alter: true }) để tự cập nhật schema (chỉ nên dùng dev)
  console.log("✅ MySQL ready (db & tables)!");
}

module.exports = { sequelize, connectDB };
