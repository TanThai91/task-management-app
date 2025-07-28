const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const createTask = async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error("Lỗi khi tạo task");
  }

  return await response.json();
};

export const updateTask = async (id, taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error("Lỗi khi cập nhật task");
  }

  return await response.json();
};
