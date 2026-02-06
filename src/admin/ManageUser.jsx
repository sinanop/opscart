

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (e) => {
    setFilterRole(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterRole("all");
    setFilterStatus("all");
    setCurrentPage(1);
  };

  const toggleStatus = async (id) => {
    const user = users.find((u) => u._id === id || u.id === id);
    if (!user) return;
  
    const newStatus = user.status === "Active" ? "Blocked" : "Active";

    try {

      const { data } = await api.patch(`/users/${id}`, { status: newStatus });

      const updatedUsers = users.map((u) =>
        (u._id === id || u.id === id) ? { ...u, status: data.status || newStatus } : u
      );
      setUsers(updatedUsers);
      toast.success(`${user.name} is now ${newStatus}`);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      user.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIdx = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + usersPerPage);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl text-orange-400 font-bold mb-6 text-center">Manage Users</h1>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearch}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
        />
        <select
          value={filterRole}
          onChange={handleRoleFilter}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select
          value={filterStatus}
          onChange={handleStatusFilter}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
        <button
          onClick={clearFilters}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading users...</div>
      ) : paginatedUsers.length === 0 ? (
        <div className="text-center text-gray-400">No users found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedUsers.map((user) => (
            <div key={user._id || user.id} className="bg-gray-900 rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-2">{user.name}</h2>
              <p className="text-gray-400"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-400"><strong>ID:</strong> {user._id || user.id}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 rounded text-xs bg-blue-800 text-blue-200">
                  {user.role}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${user.status === "Active" ? "bg-green-800 text-green-200" : "bg-red-800 text-red-200"
                    }`}
                >
                  {user.status}
                </span>
              </div>
              <button
                onClick={() => toggleStatus(user._id || user.id)}
                className={`mt-4 w-full px-4 py-2 rounded text-white ${user.status === "Active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                {user.status === "Active" ? "Block" : "Unblock"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-700 hover:bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-700 hover:bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}



