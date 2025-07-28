import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onEdit, onDelete }) => {
  if (tasks.length === 0) {
    return <p className="text-center text-muted">Chưa có công việc nào.</p>;
  }

  return (
    <div className="row">
      {tasks.map(task => (
        <div className="col-md-6 mb-3" key={task.id}>
          <TaskItem task={task} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
