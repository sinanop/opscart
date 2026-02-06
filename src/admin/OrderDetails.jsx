

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrder(data);
      setStatus(data.status);

      if (data.userId) {
        if (typeof data.userId === 'object') {
         
          setUser(data.userId);
        } else {
          try {
            const userRes = await api.get(`/users/${data.userId}`);
            setUser(userRes.data);
          } catch (uErr) {
            console.error("Failed to fetch user info", uErr);
            setUser({ name: "Unknown User" });
          }
        }
      } else {
        setUser({ name: "Guest" });
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
    }
  };

  const handleSave = async () => {
    try {
      await api.patch(`/orders/${orderId}`, { status });
      toast.success("Order status updated!");
      navigate("/admin/orders");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  if (!order || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading order details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-lg mx-auto bg-gray-800 p-4 md:p-6 rounded shadow-lg">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Order Details</h2>
        <div className="space-y-2 text-sm md:text-base">
          <p><strong>Order ID:</strong> {order._id || order.id}</p>
          <p><strong>User ID:</strong> {order.userId ? (order.userId._id || order.userId) : 'N/A'}</p>
          <p><strong>User Name:</strong> {user.name}</p>
          <p><strong>Date:</strong> {order.date ? new Date(order.date).toLocaleString() : 'N/A'}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount || order.total}</p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Products:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
            {order.products ? order.products.map((item, index) => (
              <li key={index}>
                {item.productId ? item.productId.title || item.productId.name : 'Unknown Product'} × {item.quantity} (₹{item.price} each)
              </li>
            )) : order.items && order.items.map((item, index) => (
              <li key={index}>
                {item.name} × {item.quantity} (₹{item.price} each)
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Update Status:</h3>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded w-full"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 w-full sm:w-auto"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}