import Todo from "../models/todoModel.js";

// Get todos with pagination
export const getTodos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const todos = await Todo.find({ userId: req.body.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Todo.countDocuments({ userId: req.body.userId });

    res.json({
      success: true,
      todos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + todos.length < total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new todo
export const createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const todo = new Todo({
      title,
      userId: req.user._id,
    });
    await todo.save();
    res.json({ success: true, todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update todo status
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const todo = await Todo.findOne({ _id: id, userId: req.user._id });
    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    todo.completed = completed;
    await todo.save();

    res.json({ success: true, todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    res.json({ success: true, message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
