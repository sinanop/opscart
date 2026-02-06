

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [km, setKm] = useState("");
  const [fuel, setFuel] = useState("");
  const [stock, setStock] = useState(1);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchProduct = async () => {
        try {
          const { data } = await api.get(`/products/${id}`);
          setImage(data.image);
          setName(data.name);
          setPrice(data.price);
          setKm(data.km);
          setFuel(data.fuel);
          setStock(data.stock !== undefined ? data.stock : 1);
          setIsEdit(true);
        } catch (error) {
          console.error(error);
          toast.error("Failed to load product details");
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !name || !price || !km || !fuel) {
      toast.error("Please fill all fields!");
      return;
    }

    const productData = {
      image,
      name,
      price: parseInt(price),
      km,
      fuel,
      stock,
    };

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, productData);
        toast.success("Car updated successfully!");
      } else {
        await api.post('/products', productData);
        toast.success("Car added successfully!");
      }
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving the product");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-black/90 p-8 rounded-xl border border-red-600 w-full max-w-md text-white">
        <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">
          {isEdit ? "Edit Car" : "Add New Car"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Enter image URL"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              required
            />
          </div>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter car name"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              required
            />
          </div>
          <div>
            <label>Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              required
            />
          </div>
          <div>
            <label>KM</label>
            <input
              type="text"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              placeholder="Enter kilometers driven"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              required
            />
          </div>
          <div>
            <label>Fuel Type</label>
            <input
              type="text"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              placeholder="Enter fuel type"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Availability</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStock(prev => prev > 0 ? 0 : 1)}
                className={`px-4 py-2 rounded font-bold transition w-full ${stock > 0
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
              >
                {stock > 0 ? 'Set as Sold Out' : 'Set as Available'}
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Current Status: <span className={stock > 0 ? "text-green-500" : "text-red-500"}>{stock > 0 ? "In Stock" : "Sold Out"}</span>
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold transition"
          >
            {isEdit ? "Update Car" : "Add Car"}
          </button>
        </form>
      </div>
    </div>
  );
}


