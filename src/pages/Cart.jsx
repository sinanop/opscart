

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); 
    if (!loggedInUser) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }
    setUser(loggedInUser);
    const storedCart = JSON.parse(localStorage.getItem(`cart_${loggedInUser.id}`)) || [];
    const cartWithQty = storedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCart(cartWithQty);

    // ✅ Listen for "cartUpdated" event to show the popup message
    const handleCartUpdated = (e) => {
      if (e.detail && e.detail.message) {
        toast.success(e.detail.message);
      }
    };
    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [navigate]);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    updateCart(updatedCart);
    toast.info("Item removed from cart.");
  };

  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updatedCart);
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleCheckout = () => {
    navigate("/payment"); 
  };

  if (!cart.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950">
        <h2 className="text-center text-3xl font-extrabold tracking-wide text-red-500 drop-shadow-xl">
          🛒 Your Cart is Empty
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-extrabold text-red-500 mb-8 text-center drop-shadow-xl tracking-wide">
          🛒 Your Cart
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cart.map((item, index) => (
            <div
              key={`${item.id}-${index}`} 
              className="relative bg-gradient-to-br from-black/90 via-gray-800 to-red-900 border border-red-600 rounded-2xl shadow-2xl p-6 text-white hover:scale-105 transition-transform duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-52 object-cover rounded-xl mb-4 hover:opacity-90 transition"
              />
              <h2 className="text-2xl font-bold text-orange-400 mb-2">
                {item.name}
              </h2>
              <p className="text-gray-300 mb-1">💰 Price: ₹{item.price}</p>
              <p className="text-gray-300 mb-1">📍 KM: {item.km}</p>
              <p className="text-gray-300 mb-2">⛽ Fuel: {item.fuel}</p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="w-10 h-10 bg-red-700 hover:bg-red-600 rounded-full text-xl font-bold transition-shadow shadow-lg"
                >
                  ➖
                </button>
                <span className="text-xl font-bold">{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item.id)}
                  className="w-10 h-10 bg-green-700 hover:bg-green-600 rounded-full text-xl font-bold transition-shadow shadow-lg"
                >
                  ➕
                </button>
              </div>
              <p className="text-gray-200 mt-2 text-center font-semibold">
                Subtotal:{" "}
                <span className="text-red-400 font-bold">
                  ₹{Number(item.price) * Number(item.quantity)}
                </span>
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="mt-4 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl w-full font-semibold transition duration-300 shadow-md"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center bg-gradient-to-br from-black/70 via-gray-900 to-red-950 p-6 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-white">
            Total Amount:{" "}
            <span className="text-green-400">₹{totalAmount}</span>
          </h2>
          <button
            onClick={handleCheckout}
            className="mt-6 bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold text-xl text-white shadow-lg transition duration-300"
          >
            ✅ Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
