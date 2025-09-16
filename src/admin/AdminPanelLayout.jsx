import React from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminPanelLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-800">
        {children}
      </div>
    </div>
  );
}
