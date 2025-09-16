import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const selected = storedProducts.find((p) => String(p.id) === String(id));
    setProduct(selected);
  }, [id]);
  if (!product) {
    return (
      <h2 className="text-center mt-20 text-2xl font-semibold text-white">
        Product not found ❌
      </h2>
    );
  }
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-gray-900">
         <img
        src="https://wallpapercave.com/wp/wp9116949.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-black/80"></div>
   <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-gradient-to-br from-black/90 to-gray-900 border border-red-600 rounded-2xl shadow-lg p-6 text-white">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-72 object-cover rounded-lg mb-6 hover:opacity-90 transition"
          />
          <h1 className="text-3xl font-bold text-red-500 mb-6 text-center drop-shadow-lg">
            {product.name}
          </h1>
          <div className="space-y-3 text-gray-300 text-lg">
            <p>
              <span className="text-orange-400 font-semibold">Price:</span> ₹{product.price}
            </p>
            <p>
              <span className="text-orange-400 font-semibold">Kilometers:</span> {product.km}
            </p>
            <p>
              <span className="text-orange-400 font-semibold">Fuel:</span> {product.fuel}
            </p>
          </div>
                    <div className="mt-8 flex justify-center">
            <Link
              to="/products"
              className="bg-red-600 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold transition"
            >
              ⬅ Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
