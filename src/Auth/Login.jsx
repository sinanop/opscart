



import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post('/users/login', { email, password });

      const userData = {
        id: data._id,
        ...data,
        isAdmin: data.role === 'admin'
      };

      const previousUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (previousUser && previousUser.id !== userData.id) {
        localStorage.removeItem(`cart_${previousUser.id}`);
        localStorage.removeItem(`wishlist_${previousUser.id}`);
      }

      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      window.dispatchEvent(new Event("userChanged"));

      toast.success("Login successful!", { position: "top-center", theme: "dark" });

      if (userData.isAdmin) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Invalid email or password!";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-center", theme: "dark" });
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black/90 text-white">
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="text-6xl mb-2"
      >
        🏎️
      </motion.div>

      <motion.h1
        className="text-5xl font-extrabold text-red-500 drop-shadow-lg mb-2 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        OpsCart<span className="text-white">.in</span>
      </motion.h1>

      <p className="text-gray-300 text-lg mb-8 text-center font-semibold drop-shadow-md">
        Drive your dream <span className="text-orange-400">Used Car</span> today
      </p>

      <motion.div
        className="bg-black/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-80 border-t-4 border-red-600 text-white"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4 text-center text-orange-400">
          Login to your Garage 
        </h2>

        {error && (
          <div className="text-center mb-3">
            <p className="text-red-500">{error}</p>
            <p className="text-white mt-1">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-orange-400 hover:underline font-semibold"
              >
                Register Now
              </Link>
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            className="border border-red-600 bg-black/70 text-white p-3 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-red-600 bg-black/70 text-white p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold shadow-lg uppercase tracking-wide"
            type="submit"
          >
            Login
          </motion.button>
        </form>

        {!error && (
          <p className="text-gray-300 text-sm mt-4 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-400 hover:underline font-semibold"
            >
              Register here
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}


