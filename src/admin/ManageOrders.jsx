// import React, { useEffect, useState } from "react";

// export default function ManageOrders() {
//   const [orders, setOrders] = useState([]);
//   const [filteredStatus, setFilteredStatus] = useState("All");

//   const API_URL = "http://localhost:5000/orders";

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const res = await fetch(API_URL);
//       if (!res.ok) throw new Error("Failed to fetch orders");
//       const data = await res.json();
//       setOrders(data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   const handleStatusChange = (e) => {
//     setFilteredStatus(e.target.value);
//   };

//   const filteredOrders = orders.filter((order) => {
//     if (filteredStatus === "All") return true;
//     return order.status === filteredStatus;
//   });

//   return (
//     <div className="min-h-screen bg-black/95 text-white p-6">
//       <h1 className="text-3xl font-bold text-orange-400 mb-6 text-center">
//         Manage Orders
//       </h1>

//       {/* Filter Dropdown */}
//       <div className="flex justify-center mb-6">
//         <select
//           value={filteredStatus}
//           onChange={handleStatusChange}
//           className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 hover:border-orange-400"
//         >
//           <option value="All">All Status</option>
//           <option value="Placed">Placed</option>
//           <option value="Shipped">Shipped</option>
//           <option value="Delivered">Delivered</option>
//         </select>
//       </div>

//       {/* Orders Table */}
//       <div className="overflow-x-auto max-w-6xl mx-auto bg-gray-900 rounded shadow">
//         <table className="min-w-full table-auto border-collapse border border-gray-700">
//           <thead>
//             <tr className="bg-gray-800">
//               <th className="border border-gray-600 px-4 py-2 text-left">Order ID</th>
//               <th className="border border-gray-600 px-4 py-2 text-left">User ID</th>
//               <th className="border border-gray-600 px-4 py-2 text-left">Status</th>
//               <th className="border border-gray-600 px-4 py-2 text-left">Date</th>
//               <th className="border border-gray-600 px-4 py-2 text-left">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="text-center p-4 text-gray-400">
//                   No orders found.
//                 </td>
//               </tr>
//             ) : (
//               filteredOrders.map((order) => (
//                 <tr key={order.id} className="hover:bg-gray-800">
//                   <td className="border border-gray-600 px-4 py-2">{order.id}</td>
//                   <td className="border border-gray-600 px-4 py-2">{order.userId}</td>
//                   <td className="border border-gray-600 px-4 py-2">{order.status || "Pending"}</td>
//                   <td className="border border-gray-600 px-4 py-2">
//                     {order.date ? new Date(order.date).toLocaleString() : "N/A"}
//                   </td>
//                   <td className="border border-gray-600 px-4 py-2">₹{order.total}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }













import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  const API_URL = "http://localhost:5000/orders"; // Backend endpoint

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    }
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    return (
      filterStatus === "all" ||
      order.status?.toLowerCase() === filterStatus.toLowerCase()
    );
  });

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-orange-400 mb-6 text-center">
        Manage Orders
      </h1>

      <div className="flex justify-center mb-4">
        <select
          value={filterStatus}
          onChange={handleStatusFilter}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white border border-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-600">Order ID</th>
              <th className="px-4 py-2 border border-gray-600">User ID</th>
              <th className="px-4 py-2 border border-gray-600">Product Name(s)</th>
              <th className="px-4 py-2 border border-gray-600">Date</th>
              <th className="px-4 py-2 border border-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-2 border border-gray-600">{order.id}</td>
                  <td className="px-4 py-2 border border-gray-600">{order.userId}</td>
                  <td className="px-4 py-2 border border-gray-600">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border border-gray-600">
                    {new Date(order.date).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border border-gray-600">₹{order.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
