import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    }
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    return (
      filterStatus === "all" ||
      order.status?.toLowerCase() === filterStatus.toLowerCase()
    );
  });

  const handleView = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-orange-400 mb-6 text-center">
        Manage Orders
      </h1>

      <div className="flex justify-center mb-4">
        <select
          value={filterStatus}
          onChange={handleStatusFilter}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white border border-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-600">Order ID</th>
              <th className="px-4 py-2 border border-gray-600">User ID</th>
              <th className="px-4 py-2 border border-gray-600">Status</th>
              <th className="px-4 py-2 border border-gray-600">Date</th>
              <th className="px-4 py-2 border border-gray-600">Total</th>
              <th className="px-4 py-2 border border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id || order.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-2 border border-gray-600">{order._id || order.id}</td>
                  <td className="px-4 py-2 border border-gray-600">
                    {order.userId ? (typeof order.userId === 'object' ? (order.userId.name || order.userId.email) : order.userId) : 'Unknown User'}
                  </td>
                  <td className="px-4 py-2 border border-gray-600 capitalize">{order.status}</td>
                  <td className="px-4 py-2 border border-gray-600">
                    {new Date(order.createdAt || order.date).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border border-gray-600">₹{order.totalAmount || order.total}</td>
                  <td className="px-4 py-2 border border-gray-600">
                    <button
                      onClick={() => handleView(order._id || order.id)}
                      className="text-blue-400 hover:underline"
                    >
                      view
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



