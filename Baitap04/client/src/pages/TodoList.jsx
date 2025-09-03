import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Sử dụng useCallback để hàm fetchTasks không bị tạo lại mỗi khi component re-render
  const fetchTasks = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      // Đảm bảo endpoint đồng nhất với các hàm khác
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks?page=${page}&limit=10`
      );
      if (data.success) {
        setTasks((prev) => [...prev, ...data.todos]);
        setHasMore(data.hasMore);
      } else {
        toast.error("Failed to fetch tasks");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop < clientHeight + 50 && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
        {
          title: newTask,
        }
      );
      if (data.success) {
        setTasks((prev) => [data.todo, ...prev]);
        setNewTask("");
        toast.success("Task added successfully");
      } else {
        toast.error(data.message || "Failed to add task");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add task");
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`, {
        completed: !completed,
      });
      if (data.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === id ? { ...task, completed: !task.completed } : task
          )
        );
      } else {
        toast.error(data.message || "Failed to update task");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`);
      if (data.success) {
        setTasks((prev) => prev.filter((task) => task._id !== id));
        toast.success("Task deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete task");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, fetchTasks]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-200 to bg-purple-400 p-6">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Todo List
        </h1>

        <form onSubmit={addTask} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
          >
            Add
          </button>
        </form>

        <div className="overflow-y-auto max-h-[60vh]" onScroll={handleScroll}>
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-md mb-2"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id, task.completed)}
                  className="w-5 h-5 text-indigo-600"
                />
                <span
                  className={
                    task.completed ? "line-through text-gray-500" : "text-gray-800"
                  }
                >
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
          {loading && (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;