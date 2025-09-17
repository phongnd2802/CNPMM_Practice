// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const configViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/api");
const { getHomepage } = require("./controllers/homeController");
const { connectDB } = require("./config/database");
const { ensureProductIndex } = require("./search/productIndex");

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configViewEngine(app);

// web routes
const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use("/", webAPI);

// api routes
app.use("/v1/api", apiRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Not found" }));

(async () => {
  try {
    await connectDB();
    await ensureProductIndex();     // 🔧 đảm bảo index ES sẵn sàng
    app.listen(port, () => console.log(`Backend listening on ${port}`));
  } catch (e) {
    console.error(">>> Error connect to DB/ES:", e);
  }
})();
