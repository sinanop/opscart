
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required!");
      toast.error("All fields are required!", { position: "top-center", theme: "dark" });
      return;
    }

    try {
      await api.post('/users/register', { name, email, password });

      toast.success("Registration successful! Please login.", { position: "top-center", theme: "dark" });
      navigate("/login");
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Something went wrong!";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-center", theme: "dark" });
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-black via-[#1a1a1a] to-[#0d0d0d] w-full h-screen"
    >

      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="text-6xl mb-3"
      >
        🚗
      </motion.div>


      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold text-red-500 mb-6 text-center drop-shadow-lg"
      >
        Join OpsCart<span className="text-white">.in</span>
      </motion.h1>

      <motion.div
        className="bg-black/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-80 border-l-4 border-orange-500 text-white"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4 text-center text-orange-400">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-3 font-semibold">{error}</p>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-3" autoComplete="off">
          <input
            type="text"
            placeholder="Full Name"
            name="new-name"
            className="border border-red-600 bg-black/70 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="off"
            data-lpignore="true"
          />
          <input
            type="email"
            placeholder="Email"
            name="new-email"
            className="border border-red-600 bg-black/70 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            data-lpignore="true"
          />
          <input
            type="password"
            placeholder="Password"
            name="new-password"
            className="border border-red-600 bg-black/70 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            data-lpignore="true"
          />

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-600 hover:bg-red-600 py-2 rounded-lg font-semibold text-white shadow-lg uppercase tracking-wide mt-2"
            type="submit"
          >
            Register
          </motion.button>
        </form>

        <p className="text-gray-300 text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 hover:underline font-semibold"
          >
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
