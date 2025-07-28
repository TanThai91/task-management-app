import React, { useEffect, useState, useRef } from "react";
import { createTask, updateTask } from "../../api/taskAPI";

const initialData = {
  title: "",
  description: "",
  status: "",
  priority: "",
  dueDate: ""
};

const TaskForm = ({ editingTask, onAdd, onUpdate, onCancelEdit }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  // Thêm ref cho từng field để focus khi lỗi
  const titleRef = useRef();
  const statusRef = useRef();
  const priorityRef = useRef();
  const dueDateRef = useRef();

  useEffect(() => {
    if (editingTask) setFormData(editingTask);
  }, [editingTask]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Tiêu đề không được bỏ trống";
    else if (formData.title.length < 5 || formData.title.length > 100)
      errs.title = "Tiêu đề phải từ 5 đến 100 ký tự";

    if (!formData.status) errs.status = "Trạng thái là bắt buộc";
    if (!formData.priority) errs.priority = "Độ ưu tiên là bắt buộc";
    if (!formData.dueDate) errs.dueDate = "Ngày hết hạn là bắt buộc";
    else if (new Date(formData.dueDate) < new Date())
      errs.dueDate = "Ngày hết hạn không được trong quá khứ";

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation
    let error = "";
    if (name === "title") {
      if (!value.trim()) error = "Tiêu đề không được bỏ trống";
      else if (value.length < 5 || value.length > 100) error = "Tiêu đề phải từ 5 đến 100 ký tự";
    }
    if (name === "status" && !value) error = "Trạng thái là bắt buộc";
    if (name === "priority" && !value) error = "Độ ưu tiên là bắt buộc";
    if (name === "dueDate") {
      const selectedDate = new Date(value);
      if (!value) error = "Ngày hết hạn là bắt buộc";
      else if (selectedDate < new Date()) error = "Ngày hết hạn không được trong quá khứ";
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Focus vào field đầu tiên có lỗi
      if (validationErrors.title) titleRef.current?.focus();
      else if (validationErrors.status) statusRef.current?.focus();
      else if (validationErrors.priority) priorityRef.current?.focus();
      else if (validationErrors.dueDate) dueDateRef.current?.focus();

      return;
    }

    try {
      if (editingTask) {
        const updated = await updateTask(formData);
        onUpdate(updated);
        setSuccess("Cập nhật task thành công!");
      } else {
        const created = await createTask({ ...formData, createdBy: user.id });
        onAdd(created);
        setSuccess("Thêm task thành công!");
        setFormData(initialData);
      }

      setErrors({});
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      alert("Đã xảy ra lỗi khi gửi dữ liệu");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-3">
        <label className="form-label">Tiêu đề</label>
        <input
          id="title"
          ref={titleRef}
          name="title"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Mô tả</label>
        <textarea
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Trạng thái</label>
        <select
          id="status"
          ref={statusRef}
          name="status"
          className={`form-select ${errors.status ? "is-invalid" : ""}`}
          value={formData.status}
          onChange={handleChange}
        >
          <option value="">-- Chọn --</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && <div className="invalid-feedback">{errors.status}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Độ ưu tiên</label>
        <select
          id="priority"
          ref={priorityRef}
          name="priority"
          className={`form-select ${errors.priority ? "is-invalid" : ""}`}
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="">-- Chọn --</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {errors.priority && <div className="invalid-feedback">{errors.priority}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Ngày hết hạn</label>
        <input
          id="dueDate"
          ref={dueDateRef}
          type="date"
          name="dueDate"
          className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
          value={formData.dueDate}
          onChange={handleChange}
        />
        {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
      </div>

      <button type="submit" className="btn btn-success me-2">
        {editingTask ? "Cập nhật" : "Thêm Task"}
      </button>
      {editingTask && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancelEdit}
        >
          Huỷ
        </button>
      )}
    </form>
  );
};

export default TaskForm;
