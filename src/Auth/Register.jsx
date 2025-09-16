
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

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
      return;
    }

    try {

      const res = await fetch(`http://localhost:5000/users?email=${email}`);
      const existing = await res.json();
      if (existing.length > 0) {
        setError("User already registered!");
        return;
      }

    
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        background: "linear-gradient(135deg, #000000, #1a1a1a, #0d0d0d)",
        width: "100%",
        height: "100vh",
      }}
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
          Create Your Account 🏁
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-3 font-semibold">{error}</p>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Full Name"
            className="border border-red-600 bg-black/70 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-red-600 bg-black/70 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-red-600 bg-black/70 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-600 hover:bg-red-600 py-2 rounded-lg font-semibold text-white shadow-lg uppercase tracking-wide mt-2"
            type="submit"
          >
            Register 🔑
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
