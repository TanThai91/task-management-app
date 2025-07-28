import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/authAPI";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!token) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span>👋 Welcome, <strong>{user?.username}</strong></span>
        <span className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </span>
      </div>
      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {/* Thêm link nếu muốn */}
        <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
