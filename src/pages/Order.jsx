


import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  const API_URL = "http://localhost:5000/orders"; 

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`${API_URL}?userId=${userId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    }
  };


  const handleDelete = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/${orderId}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete order");
      }
      setOrders(orders.filter((order) => order.id !== orderId));
      toast.success("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
      setUser(storedUser);
      fetchOrders(storedUser.id);
    }
  }, []);


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h2>Please login to view your orders.</h2>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h2>No orders found 🛒</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-black via-gray-900 to-red-950 text-white">
      <h1 className="text-4xl font-extrabold text-red-500 mb-8 text-center">
        📦 Your Orders
      </h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        {orders.map((order) => (
          <div
            key={order.id} 
            className="bg-black/80 p-6 rounded-2xl shadow-xl border border-red-600"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-400">
                Order #{order.id}
              </h2>
              <button
                onClick={() => handleDelete(order.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Delete
              </button>
            </div>

            <p className="text-gray-300 mb-1">👤 Buyer: {order.buyer}</p>
            <p className="text-gray-300 mb-1">📞 Phone: {order.phone}</p>
            <p className="text-gray-400 mb-3">📅 Date: {order.date}</p>
            <p className="text-gray-300 mb-1">🏠 Address: {order.address}</p>

            <ul className="mb-4 space-y-2">
              {order.items.map((item, index) => (
                <li
                  key={`${order.id}-${index}`} 
                  className="flex justify-between border-b border-gray-700 pb-1"
                >
                  <div>
                    <span>
                      {item.name} × {item.quantity}
                    </span>
               
                    {item.brand && (
                      <div className="text-xs text-gray-500">
                        Brand: {item.brand}
                      </div>
                    )}
                  </div>
                  <span>₹{Number(item.price) * Number(item.quantity)}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-bold text-green-400">
              Total Paid: ₹{order.total}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
