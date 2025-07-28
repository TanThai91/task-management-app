import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Auth/LoginForm";
import Navbar from "./components/Auth/Navbar";
import TaskPage from "./components/Tasks/TaskManagement";
import PrivateRoute from "./components/Auth/PrivateRoute";
import AdminRoute from "./components/Auth/AdminRoute";
import TaskManagement from "./components/Tasks/TaskManagement";
import './App.css';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<PrivateRoute><TaskPage /></PrivateRoute>} />
        <Route path="/tasks" element={<AdminRoute>    <TaskManagement />
          </AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;