import * as express from "express";
import * as dotenv from "dotenv";
import sequelize from "./config/database";
import taskRoutes from "./routes/task.routes";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
// Middleware
app.use(express.json());
// Routes
app.use("/tasks", taskRoutes);
// Sync DB & start server
(async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected");
    await sequelize.sync();
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Unable to connect:", error);
  }
})();
