


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const COLORS = ["#4f46e5", "#facc15", "#10b981"];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [ordersData, setOrdersData] = useState([]);
  const [carsData, setCarsData] = useState([]);

  useEffect(() => {
    // Fetch users
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setTotalUsers(data.length));

    // Fetch products
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        setTotalProducts(data.length);

        const brandCount = {};
        data.forEach((product) => {
          const brand = product.brand || "Unknown"; // fallback if undefined
          brandCount[brand] = (brandCount[brand] || 0) + 1;
        });

        const brandsArray = Object.keys(brandCount).map((brand) => ({
          name: brand,
          count: brandCount[brand],
        }));

        setCarsData(brandsArray);
      });

    // Fetch orders
    fetch("http://localhost:5000/orders")
      .then((res) => res.json())
      .then((data) => {
        setTotalOrders(data.length);

        const revenue = data.reduce((sum, order) => sum + Number(order.total || 0), 0);
        setTotalRevenue(revenue);

        const statusCount = { Placed: 0, Shipped: 0, Delivered: 0 };
        data.forEach((order) => {
          const status = order.status || "Placed"; // default fallback
          statusCount[status] = (statusCount[status] || 0) + 1;
        });

        setOrdersData([
          { name: "Placed", value: statusCount.Placed },
          { name: "Shipped", value: statusCount.Shipped },
          { name: "Delivered", value: statusCount.Delivered },
        ]);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const goToManageProducts = () => {
    navigate("/admin/products");
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className="flex-1 p-6 bg-black/95">
        <h1 className="text-2xl font-bold text-orange-400 mb-6">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-md p-4">
            <p className="text-gray-400 text-sm">Total Users</p>
            <h2 className="text-xl font-bold">{totalUsers}</h2>
          </div>
          <div className="bg-gray-800 rounded-md p-4">
            <p className="text-gray-400 text-sm">Total Products</p>
            <h2 className="text-xl font-bold">{totalProducts}</h2>
          </div>
          <div className="bg-gray-800 rounded-md p-4">
            <p className="text-gray-400 text-sm">Total Orders</p>
            <h2 className="text-xl font-bold">{totalOrders}</h2>
          </div>
          <div className="bg-gray-800 rounded-md p-4">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <h2 className="text-xl font-bold">₹{totalRevenue.toLocaleString()}</h2>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orders Pie Chart */}
          <div className="bg-gray-800 rounded-md p-4 h-64">
            <h3 className="text-white font-semibold mb-3">Orders by Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ordersData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  label
                >
                  {ordersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Car Brands Bar Chart */}
          <div className="bg-gray-800 rounded-md p-4 h-64">
            <h3 className="text-white font-semibold mb-3">Car Brands</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={carsData}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
