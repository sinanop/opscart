



import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditProduct() {
  const { id } = useParams(); // id may be undefined in Add mode
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [km, setKm] = useState("");
  const [fuel, setFuel] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    if (id) {
      const existingProduct = products.find(
        (prod) => String(prod.id) === String(id)
      );
      if (existingProduct) {
        setImage(existingProduct.image);
        setName(existingProduct.name);
        setPrice(existingProduct.price);
        setKm(existingProduct.km);
        setFuel(existingProduct.fuel);
        setIsEdit(true);
      }
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!image || !name || !price || !km || !fuel) {
      toast.error("Please fill all fields!");
      return;
    }

    const products = JSON.parse(localStorage.getItem("products")) || [];

    if (isEdit) {
      // ✅ Edit mode: update the existing product
      const updatedProducts = products.map((prod) =>
        String(prod.id) === String(id)
          ? { ...prod, image, name, price, km, fuel }
          : prod
      );
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      toast.success("Car updated successfully!");
    } else {
      // ✅ Add mode: create a new product
      const newProduct = {
        id: Date.now(), // unique id
        image,
        name,
        price,
        km,
        fuel,
      };
      const updatedProducts = [...products, newProduct];
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      toast.success("Car added successfully!");
    }

    window.dispatchEvent(new Event("customStorageChange"));
    navigate("/admin/products");
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
            />
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
