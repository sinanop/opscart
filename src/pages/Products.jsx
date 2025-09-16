import { useEffect, useState } from "react";
import { useWishlist } from "./wishlist";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Products() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {

    const storedProducts = JSON.parse(localStorage.getItem("products"));

    if (storedProducts && storedProducts.length > 0) {
      setCars(storedProducts);
      setLoading(false);
    } else {
 
      fetch("http://localhost:5000/products")
        .then((res) => res.json())
        .then((data) => {
          setCars(data);
          setLoading(false);
          localStorage.setItem("products", JSON.stringify(data));
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
          setLoading(false);
        });
    }
  }, []); 

  const handleAddToCart = (car) => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      toast.error("Please login first to add items to cart.");
      return;
    }

    const existingCart =
      JSON.parse(localStorage.getItem(`cart_${loggedInUser.id}`)) || [];

    const isAlreadyInCart = existingCart.some((item) => item.id === car.id);
    if (isAlreadyInCart) {
      toast.info(`${car.name} is already in the cart.`);
      return;
    }

    const updatedCart = [...existingCart, car];
    localStorage.setItem(`cart_${loggedInUser.id}`, JSON.stringify(updatedCart));
    toast.success(`${car.name} added to cart!`);
  };

  const handleWishlistToggle = (car) => {
    if (wishlist.some((item) => item.id === car.id)) {
      removeFromWishlist(car.id);
      toast.info(`${car.name} removed from wishlist.`);
    } else {
      addToWishlist(car);
      toast.success(`${car.name} added to wishlist.`);
    }
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
          🚗 Available Cars
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="relative bg-gradient-to-br from-black/90 to-gray-900 border border-red-600 rounded-xl shadow-lg p-4 text-white hover:scale-105 hover:shadow-red-500/50 transition-transform duration-300 ease-in-out"
            >
              <button
                onClick={() => handleWishlistToggle(car)}
                className="absolute top-4 right-4 text-2xl transition-transform duration-300 hover:scale-125"
              >
                {wishlist.some((item) => item.id === car.id) ? (
                  <span className="text-red-500">❤️</span>
                ) : (
                  <span className="text-white hover:text-red-500">🤍</span>
                )}
              </button>

              <Link to={`/products/${car.id}`}>
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

              <button
                onClick={() => handleAddToCart(car)}
                className="mt-4 bg-red-600 hover:bg-orange-600 px-4 py-2 rounded-lg w-full font-semibold transition duration-300"
              >
                Add to Cart 🛒
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

