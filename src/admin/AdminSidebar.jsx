import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaThLarge, FaBoxOpen, FaClipboardList, FaUsers, FaSignOutAlt } from "react-icons/fa";

export default function AdminSidebar({ isOpen, onClose }) {
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
    <>
  
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`w-64 bg-black/95 text-white h-screen p-4 border-r border-gray-800 fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-400">Admin Panel</h2>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <nav className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => onClose && onClose()} 
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-orange-600 ${isActive ? "bg-orange-600 text-black" : "text-gray-300 hover:text-white"
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
    </>
  );
}


