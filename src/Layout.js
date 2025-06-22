import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import "./footer.css";

const Layout = ({ children, userRole }) => {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo-text">Complisense</div>
          <nav className="nav-links">
            <Link to="/all-tasks">Tasks</Link>
            <Link to="/dashboard">Dashboard</Link>
            {userRole === "admin" && <Link to="/admin">Admin</Link>}
          </nav>
        </div>

        {/* Header Right Section */}
        <div className="header-right">
          <div className="notification-bell">🔔</div>
          <div className="user-dropdown">
            <span className="user-name">👤 User</span>
            {/* In future: Add real dropdown for Profile | Change Password | Logout */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">{children}</main>

      {/* Footer */}
      <footer className="footer">
        <p>Powered by Complisense © 2024 All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
