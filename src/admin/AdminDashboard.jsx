
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
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
    fetchData();
    const interval = setInterval(fetchData, 5000); 

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
 
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get('/users').catch(e => ({ data: [] })),
        api.get('/products').catch(e => ({ data: [] })),
        api.get('/orders').catch(e => ({ data: [] }))
      ]);

      setTotalUsers(usersRes.data.length || 0);
      setTotalProducts(productsRes.data.length || 0);

      const orders = ordersRes.data || [];
      setTotalOrders(orders.length);

      const revenue = orders.reduce((sum, order) => {
        const status = (order.status || "").toLowerCase();
        if (status === "shipped" || status === "delivered") {
          return sum + Number(order.totalAmount || order.total || 0);
        }
        return sum;
      }, 0);
      setTotalRevenue(revenue);

    
      const statusCount = {};
      orders.forEach((order) => {
      
        let status = order.status || "Pending";
        status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

        statusCount[status] = (statusCount[status] || 0) + 1;
      });

      const chartData = Object.keys(statusCount).map(key => ({
        name: key,
        value: statusCount[key]
      }));
      setOrdersData(chartData);

  
      const carCount = {};
      orders.forEach((order) => {
        const items = order.products || order.items || [];
        items.forEach((item) => {
          let name = "Unknown";
          if (item.productId && typeof item.productId === 'object') {
            name = item.productId.name || item.productId.title || "Unknown";
          } else if (item.name) {
            name = item.name;
          }

          if (name !== "Unknown") {
            carCount[name] = (carCount[name] || 0) + (item.quantity || 1);
          }
        });
      });

      const carsArray = Object.keys(carCount)
        .map((name) => ({
          name: shortenCarName(name),
          fullName: name,
          count: carCount[name],
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setCarsData(carsArray);

    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };


  const shortenCarName = (name) => {
    let words = name.split(" ");

    const brands = ["Toyota", "Hyundai", "Maruti", "Suzuki", "Honda", "Kia", "BMW", "Audi", "Mercedes", "Ford", "Mahindra", "Tata"];
    words = words.filter((w) => !brands.includes(w));


    return words.join(" ") || name;
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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


          <div className="bg-gray-800 rounded-md p-4 h-64">
            <h3 className="text-white font-semibold mb-3">Most Ordered Cars</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={carsData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  stroke="#ccc"
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
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


