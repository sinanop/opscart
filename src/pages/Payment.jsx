import React, { useState, useEffect } from "react";  
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Payment() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [user, setUser] = useState(null);

  const API_URL = "http://localhost:5000/orders";

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); 
    if (!loggedInUser) {
      navigate("/login");
      return;
    }
    setUser(loggedInUser);
    const storedCart =
      JSON.parse(localStorage.getItem(`cart_${loggedInUser.id}`)) || [];
    const cartWithNumbers = storedCart.map((item) => ({
      ...item,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    }));
    setCart(cartWithNumbers);
    if (loggedInUser.name) setName(loggedInUser.name);
    if (loggedInUser.email) setEmail(loggedInUser.email);
  }, [navigate]);

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!name || !address || !phone) {
      alert("Please fill in all required details!");
      return;
    }
    if (!user) return;

    const newOrder = {
      userId: user.id,
      items: cart,
      total: totalAmount,
      buyer: name,
      address,
      phone,
      email,
      paymentMethod,
      date: new Date().toLocaleString(),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });

      if (!res.ok) throw new Error("Failed to place order");

      toast.success("Order placed successfully!");
      localStorage.removeItem(`cart_${user.id}`);
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to process payment. Please try again!");
    }
  };

  if (!cart.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold text-red-500 drop-shadow-xl mb-4">
            🛒 Your cart is empty!
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/products")}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg"
          >
            Browse Products
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950 p-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-black/80 p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-white border-t-4 border-red-600"
      >
        <motion.h1
          className="text-3xl font-bold text-red-500 mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          💳 Payment Details
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-orange-400 mb-4 border-b border-gray-700 pb-2">
              Order Summary
            </h2>
            <div className="mb-6 max-h-60 overflow-y-auto pr-2">
              {cart.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex justify-between border-b border-gray-700 py-3"
                >
                  <span className="flex-1">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ₹{Number(item.price) * Number(item.quantity)}
                  </span>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="flex justify-between text-xl font-bold text-green-400 mb-6 pt-4 border-t border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span>Total Amount:</span>
              <span>₹{totalAmount}</span>
            </motion.div>
          </motion.div>

          <motion.form
            onSubmit={handlePayment}
            className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-orange-400 mb-4 border-b border-gray-700 pb-2">
                Shipping Details
              </h2>
            </div>
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-red-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <textarea
                placeholder="Delivery Address *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-red-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="3"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-red-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-red-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2 mt-4">
              <h2 className="text-xl font-bold text-orange-400 mb-4 border-b border-gray-700 pb-2">
                Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="hidden"
                  />
                  <label
                    htmlFor="card"
                    className={`block p-4 rounded-lg cursor-pointer text-center border-2 ${
                      paymentMethod === "card"
                        ? "border-red-500 bg-red-500/20"
                        : "border-gray-700 bg-gray-800"
                    }`}
                  >
                    💳 Credit/Debit Card
                  </label>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="hidden"
                  />
                  <label
                    htmlFor="cod"
                    className={`block p-4 rounded-lg cursor-pointer text-center border-2 ${
                      paymentMethod === "cod"
                        ? "border-red-500 bg-red-500/20"
                        : "border-gray-700 bg-gray-800"
                    }`}
                  >
                    📦 Cash on Delivery
                  </label>
                </motion.div>
              </div>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="md:col-span-2 bg-green-600 hover:bg-green-700 p-4 rounded-lg font-bold text-lg shadow-lg transition mt-6"
            >
              {paymentMethod === "cod" ? "📦 Confirm Order" : "💳 Pay Now"} - ₹{totalAmount}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
