import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product", err);
      }
    };
    fetchProduct();
  }, [id]);
  if (!product) {
    return (
      <h2 className="text-center mt-20 text-2xl font-semibold text-white">
        Product not found
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
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/products"
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold transition text-white"
            >
              Back
            </Link>
            {product.stock > 0 ? (
              <>
                <button
                  onClick={async () => {
                    try {
                      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
                      if (!loggedInUser) return toast.error("Please login to buy");
                      await api.post('/cart', { productId: product._id || product.id, quantity: 1 });
                      window.location.href = '/payment';
                    } catch (err) {
                      console.error(err);
                      if (err.response?.status === 400) {
                        toast.info("Already in cart. Redirecting to payment...");
                        setTimeout(() => {
                          window.location.href = '/payment';
                        }, 1000);
                      } else {
                        toast.error(err.response?.data?.message || "Failed to add to cart");
                      }
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition text-white"
                >
                  Buy Now
                </button>
              
              </>
            ) : (
              <button disabled className="bg-gray-500 cursor-not-allowed px-6 py-2 rounded-lg font-semibold text-white">
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
