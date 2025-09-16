
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/users?email=${email}`);
      const existing = await res.json();
      if (existing.length > 0) {
        setError("User already exists!");
        return;
      }

 
      const newUser = { name, email, password };
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const savedUser = await response.json();

    
      localStorage.setItem("loggedInUser", JSON.stringify(savedUser));
      alert("Registration successful! You are logged in.");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <form className="bg-gray-800 p-8 rounded-xl w-full max-w-md text-gray-200" onSubmit={handleRegister}>
        <h1 className="text-2xl font-bold mb-6 text-red-500">Register</h1>
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input type="text" placeholder="Name" className="w-full mb-4 p-2 rounded bg-gray-700" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" className="w-full mb-4 p-2 rounded bg-gray-700" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full mb-4 p-2 rounded bg-gray-700" value={password} onChange={e => setPassword(e.target.value)} required />

        <button type="submit" className="w-full bg-red-500 hover:bg-red-600 p-2 rounded font-bold">Register & Login</button>
      </form>
    </div>
  );
}
