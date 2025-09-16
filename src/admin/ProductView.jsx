// src/admin/ProductView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const foundProduct = products.find((prod) => prod.id.toString() === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setProduct(null);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h2>Product not found.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-black/90 p-8 rounded-xl border border-red-600 w-full max-w-md text-white">
        <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">
          {product.name}
        </h2>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <p><strong>Price:</strong> ₹{product.price}</p>
        <p><strong>Category:</strong> {product.category}</p>
        {product.km && <p><strong>KM:</strong> {product.km}</p>}
        {product.fuel && <p><strong>Fuel:</strong> {product.fuel}</p>}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          Back
        </button>
      </div>
    </div>
  );
}
