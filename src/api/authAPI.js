const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const login = async ({ username, password }) => {
  const res = await fetch(`${API_BASE_URL}/users`);
  const users = await res.json();

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) throw new Error("Sai tài khoản hoặc mật khẩu");

  const fakeToken = "fake-token-123";
  localStorage.setItem("token", fakeToken);
  localStorage.setItem("user", JSON.stringify(user));

  return { user, token: fakeToken };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};