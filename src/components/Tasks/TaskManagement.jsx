import React, { useEffect, useState } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import debounce from "lodash.debounce";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/tasks");
      if (!res.ok) throw new Error("Không thể kết nối đến api");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá?")) return;
    try {
      await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "DELETE",
      });
      fetchTasks();
    } catch (err) {
      alert("Xóa thất bại");
    }
  };

  const handleAdd = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleUpdate = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setEditingTask(null);
  };

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value.toLowerCase());
  }, 300);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm));
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      if (sortBy === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === "createdAt") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "priority") {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container">
      <h2 className="mb-4">Quản lý Tasks</h2>
      {user.role === "admin" && (
        <TaskForm
          onAdd={handleAdd}
          editingTask={editingTask}
          onUpdate={handleUpdate}
          onCancelEdit={() => setEditingTask(null)}
        />
      )}

      <div className="mb-3 row g-2 align-items-center">
        <div className="col-sm-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="form-control"
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-sm-3">
          <select className="form-select" onChange={handleFilterChange}>
            <option value="all">Tất cả trạng thái</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="col-sm-3">
          <select className="form-select" onChange={handleSortChange}>
            <option value="">Sắp xếp theo...</option>
            <option value="dueDate">Ngày hết hạn</option>
            <option value="createdAt">Ngày tạo</option>
            <option value="priority">Độ ưu tiên</option>
          </select>
        </div>
      </div>

      <TaskList tasks={filteredTasks} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default TaskManagement;
