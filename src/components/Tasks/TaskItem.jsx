import React from "react";

const TaskItem = ({ task, onEdit, onDelete }) => {
  const getStatusColor = status => {
    switch (status) {
      case "todo": return "secondary";
      case "in-progress": return "warning";
      case "completed": return "success";
      default: return "light";
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="card shadow-sm">
      <div className={`card-header bg-${getStatusColor(task.status)} text-white`}>
        {task.title}
      </div>
      <div className="card-body">
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>

        {/* Chỉ hiện nút nếu là admin */}
        {user?.role === "admin" && (
          <>
            <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(task)}>Sửa</button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(task.id)}>Xóa</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
