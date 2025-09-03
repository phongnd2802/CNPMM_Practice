import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";

const router = express.Router();

// Protected routes - require authentication
router.use(userAuth);

// Get todos with pagination
router.get("/", getTodos);

// Create new todo
router.post("/", createTodo);

// Update todo status
router.put("/:id", updateTodo);

// Delete todo
router.delete("/:id", deleteTodo);

export default router;
