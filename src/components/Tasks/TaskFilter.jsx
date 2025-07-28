import React from "react";

const TaskFilter = ({ search, setSearch, statusFilter, setStatusFilter, sortBy, setSortBy }) => {
  return (
    <div className="row mb-3">
      <div className="col-md-4 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm theo tiêu đề hoặc mô tả"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="col-md-3 mb-2">
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="col-md-3 mb-2">
        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="createdAt">Mới nhất</option>
          <option value="dueDate">Số gần deadline</option>
          <option value="priority">Độ ưu tiên</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilter;

// === Tích hợp vào TaskManagement.jsx ===
// (phần trên giữ nguyên)
import TaskFilter from "./TaskFilter";

const TaskManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

  // ... fetchTasks v.v. như cũ

  const filteredTasks = tasks
    .filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
    )
    .filter((t) => (statusFilter === "all" ? true : t.status === statusFilter))
    .sort((a, b) => {
      if (sortBy === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === "priority") {
        const weight = { high: 1, medium: 2, low: 3 };
        return weight[a.priority] - weight[b.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="container">
      <h2 className="mb-4">Quản lý Tasks</h2>
      <TaskForm
        onAdd={handleAdd}
        editingTask={editingTask}
        onUpdate={handleUpdate}
        onCancelEdit={() => setEditingTask(null)}
      />
      <TaskFilter
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <TaskList tasks={filteredTasks} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};