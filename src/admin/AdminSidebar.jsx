
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaThLarge, FaBoxOpen, FaClipboardList, FaUsers, FaSignOutAlt } from "react-icons/fa";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaThLarge /> },
    { name: "Manage Products", path: "/admin/products", icon: <FaBoxOpen /> },
    { name: "Manage Orders", path: "/admin/orders", icon: <FaClipboardList /> },
    { name: "Manage Users", path: "/admin/users", icon: <FaUsers /> },
  ];

  return (
    <div className="w-64 bg-black/95 text-white min-h-screen p-4 border-r border-gray-800">
      <h2 className="text-2xl font-bold text-orange-400 mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-orange-600 ${
                isActive ? "bg-orange-600 text-black" : "text-gray-300 hover:text-white"
              }`
            }
          >
            <span className="mr-3 text-lg">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 rounded-lg text-red-500 hover:bg-red-600 hover:text-white transition-colors w-full"
        >
          <FaSignOutAlt className="mr-3 text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
}
