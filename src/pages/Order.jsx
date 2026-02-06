


import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    const toastId = toast.loading("Cancelling order...");
    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast.update(toastId, { render: "Order cancelled successfully", type: "success", isLoading: false, autoClose: 3000 });
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.update(toastId, { render: error.response?.data?.message || "Failed to cancel order", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
      setUser(storedUser);
      fetchOrders();
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
    <div className="min-h-screen p-6 pb-20 bg-gradient-to-br from-black via-gray-900 to-red-950 text-white">
      <h1 className="text-4xl font-extrabold text-red-500 mb-8 text-center">
        Your Orders
      </h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-black/80 p-6 rounded-2xl shadow-xl border border-red-600"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-400">
                Order #{order._id}
              </h2>
              <span className={`px-4 py-1 rounded-full text-sm capitalize font-bold ${order.status === 'delivered' ? 'bg-green-600 text-white' :
                order.status === 'cancelled' ? 'bg-red-600 text-white' :
                  'bg-yellow-600 text-white'
                }`}>
                {order.status}
              </span>
            </div>

            <p className="text-gray-300 mb-1">👤 Buyer: {order.userId ? order.userId.name : 'Unknown'}</p>
            <p className="text-gray-300 mb-1">📞 Phone: {order.address?.phone || order.userId?.phoneNumber || 'N/A'}</p>
            <p className="text-gray-400 mb-3">📅 Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <div className="text-gray-300 mb-3">
              <p>🏠 Address:</p>
              <p className="ml-4 text-sm text-gray-400">
                {typeof order.address === 'object' ? (
                  <>
                    {order.address.line || ''} <br />
                    {order.address.city || ''}, {order.address.state || ''} - {order.address.pincode || ''}
                  </>
                ) : order.address}
              </p>
            </div>

            <ul className="mb-4 space-y-2 bg-gray-900/50 p-4 rounded-xl">
              {order.products.map((item, index) => (
                <li
                  key={`${order._id}-${index}`}
                  className="flex justify-between border-b border-gray-700 pb-2 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    {item.productId?.image && <img src={item.productId.image} alt="" className="w-12 h-12 rounded object-cover" />}
                    <div>
                      <p className="font-semibold text-white">{item.productId ? item.productId.title || item.productId.name : 'Product Unavailable'}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-200">₹{Number(item.price) * Number(item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
              <h3 className="text-xl font-bold text-green-400">
                Total Paid: ₹{order.totalAmount}
              </h3>
              {order.status === 'pending' && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
