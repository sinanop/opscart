
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products"));
    if (storedProducts && storedProducts.length > 0) {
      setProducts(storedProducts);
    }
  }, []);

  const handleDelete = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleAddProduct = () => {
    navigate("/admin/products/edit/new");
  };

  const handleView = (id) => {
    navigate(`/admin/products/view/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-orange-400">Manage Products</h1>
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Add Product
          </button>
        </div>

        <table className="min-w-full bg-white text-gray-700 table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 border border-gray-300 text-left">Image</th>
              <th className="py-3 px-4 border border-gray-300 text-left">Name</th>
              <th className="py-3 px-4 border border-gray-300 text-left">Price</th>
              <th className="py-3 px-4 border border-gray-300 text-left">Category</th>
              <th className="py-3 px-4 border border-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border border-gray-300">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-20 object-cover rounded-md mx-auto"
                  />
                </td>
                <td className="py-2 px-4 border border-gray-300">{product.name}</td>
                <td className="py-2 px-4 border border-gray-300">₹{product.price}</td>
                <td className="py-2 px-4 border border-gray-300">{product.category}</td>
                <td className="py-2 px-4 border border-gray-300 space-x-2 text-center">
                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleView(product.id)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm"
                  >
                    👁️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center text-gray-500 mt-6">No products available.</div>
        )}
      </div>
    </div>
  );
}
