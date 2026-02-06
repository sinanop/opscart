
import { useEffect, useState } from "react";
import { useWishlist } from "./Wishlist";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function Products() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setCars(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  const handleAddToCart = async (car) => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      toast.error("Please login first to add items to cart.");
      return;
    }

    try {
      await api.post('/cart', { productId: car._id || car.id, quantity: 1 });
      toast.success(`${car.name} added to cart!`);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        toast.info("Already added in cart");
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  const handleWishlistToggle = (car) => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      toast.error("Please login to add to wishlist");
      return;
    }

    const inWishlist = wishlist.some((item) => {
      const itemId = item._id || item.id;
      const carId = car._id || car.id;
      return itemId && carId && itemId === carId;
    });

    if (inWishlist) {
      removeFromWishlist(car._id || car.id);
      toast.info(`${car.name} removed from wishlist.`);
    } else {
      addToWishlist(car);
      toast.success(`${car.name} added to wishlist.`);
    }
  };


  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 8;

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  const totalPages = Math.ceil(cars.length / carsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return (
      <h2 className="text-center mt-20 text-2xl font-semibold text-white">
        Loading cars...
      </h2>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-gray-900">
      <img
        src="https://wallpapercave.com/wp/wp9116949.jpg"
        alt="Car Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-black/80"></div>
      <div className="relative z-10 w-full max-w-7xl">
        <h1 className="text-4xl font-bold text-red-500 mb-8 text-center drop-shadow-lg">
          Available Cars
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentCars.map((car) => (
            <div
              key={car._id || car.id}
              className="relative bg-gradient-to-br from-black/90 to-gray-900 border border-red-600 rounded-xl shadow-lg p-4 text-white hover:scale-105 hover:shadow-red-500/50 transition-transform duration-300 ease-in-out"
            >
              <button
                onClick={() => handleWishlistToggle(car)}
                className="absolute top-4 right-4 text-2xl transition-transform duration-300 hover:scale-125 z-10"
              >
                {wishlist.some((item) => {
                  const itemId = item._id || item.id;
                  const carId = car._id || car.id;
                  return itemId && carId && itemId === carId;
                }) ? (
                  <span className="text-red-500">❤️</span>
                ) : (
                  <span className="text-white hover:text-red-500">🤍</span>
                )}
              </button>

              <Link to={`/products/${car._id || car.id}`}>
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover rounded-lg mb-4 hover:opacity-90 transition"
                />
                <h2 className="text-xl font-bold text-orange-400">{car.name}</h2>
              </Link>

              <p className="text-gray-300">Price: ₹{car.price}</p>
              <p className="text-gray-300">KM: {car.km}</p>
              <p className="text-gray-300">Fuel: {car.fuel}</p>

              <div className="flex gap-2 mt-4">
                {car.stock > 0 ? (
                  <>
                    <button
                      onClick={() => handleAddToCart(car)}
                      className="bg-red-600 hover:bg-orange-600 px-3 py-2 rounded-lg flex-1 font-semibold transition duration-300 text-sm"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={async () => {
                        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
                        if (!loggedInUser) return toast.error("Please login to buy");
                        try {
                          await api.post('/cart', { productId: car._id || car.id, quantity: 1 });
                      
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
                      className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg flex-1 font-semibold transition duration-300 text-sm"
                    >
                      Buy Now
                    </button>
                  </>
                ) : (
                  <button disabled className="bg-gray-500 cursor-not-allowed px-4 py-2 rounded-lg w-full font-semibold">
                    Sold Out
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

       
        <div className="flex justify-center items-center mt-12 gap-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 ${currentPage === 1
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700 hover:scale-110 shadow-lg shadow-red-500/50"
              }`}
          >
            ← Previous
          </button>

          <span className="text-white font-bold text-xl bg-black/50 px-4 py-2 rounded-lg border border-red-500/30">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 ${currentPage === totalPages
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700 hover:scale-110 shadow-lg shadow-red-500/50"
              }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
