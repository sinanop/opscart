import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { FaBars } from "react-icons/fa";

export default function AdminPanelLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white relative">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />


      <div className="md:hidden p-4 bg-gray-800 flex items-center">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-white p-2 focus:outline-none"
        >
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-bold text-orange-400">Admin Dashboard</h1>
      </div>

      <div className="flex-1 md:ml-64 p-4 sm:p-6 bg-gray-800">
        {children}
      </div>
    </div>
  );
}


