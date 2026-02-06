
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id && p.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Manage Products</h1>
        <button
          onClick={() => navigate("/admin/products/edit/new")}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
        >
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p._id || p.id}
                className="border-b border-gray-600 hover:bg-gray-700"
              >
                <td className="p-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => navigate(`/admin/products/view/${p._id || p.id}`)}
                    className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/admin/products/edit/${p._id || p.id}`)}
                    className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id || p.id)}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

