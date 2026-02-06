import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";


const carBrands = [
  { name: "Suzuki", logo: "https://img.joomcdn.net/0c1c0b41ad9195a07d3de9ab9e55220e1bd2b6bb_original.jpeg" },
  { name: "Toyota", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE5e29cWA-9XT7dpsG6uHlVUhPhFcY-hIt8TS1CUA7CaB1kyXqNuM_SLsJi6LvAqOkjZ8&usqp=CAU" },
  { name: "Hyundai", logo: "https://static.vecteezy.com/system/resources/previews/020/502/874/non_2x/hyundai-brand-logo-car-symbol-white-design-south-korean-automobile-illustration-with-black-background-free-vector.jpg" },
  { name: "Tata", logo: "https://market-resized.envatousercontent.com/previews/files/65276857/TATA%28590x590%29.jpeg?w=590&h=590&cf_fit=crop&crop=top&format=auto&q=85&s=5d7c5319e92ad15e40248f73705635015c7576da2a6a40f040f274ef2aa9ace4" },
  { name: "Audi", logo: "https://i.pinimg.com/564x/10/71/3f/10713fa25df3ea76d948dc73bd8c53e8.jpg" },
  { name: "BMW", logo: "https://i.pinimg.com/736x/8b/b1/84/8bb184b137c8858d430b5e8555795f31.jpg" },
  { name: "Benz", logo: "https://w0.peakpx.com/wallpaper/266/460/HD-wallpaper-mercedes-benz-black-logo-net.jpg" },
  { name: "Volkswagen", logo: "https://i.pinimg.com/736x/2c/46/4d/2c464dd8d43a9ba2d9234d39dc15f9bb.jpg" },
];

export default function Home() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, wishlistRes] = await Promise.all([
          api.get('/products?sort=sold'),
          api.get('/wishlist').catch(() => ({ data: { products: [] } }))
        ]);
        setCars(productsRes.data);
        const wishlistIds = wishlistRes.data.products ? wishlistRes.data.products.map(p => p._id || p) : [];
        setWishlist(wishlistIds);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (search || selectedBrand) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [search, selectedBrand]);

  const handleSearch = () => {
    console.log(`Searching for: ${search} | Brand: ${selectedBrand}`);
  };

  const toggleWishlist = async (e, carId) => {
    e.stopPropagation();
    try {
      if (wishlist.includes(carId)) {
        await api.delete(`/wishlist/${carId}`);
        setWishlist(prev => prev.filter(id => id !== carId));
        toast.info("Removed from wishlist");
      } else {
        await api.post('/wishlist', { productId: carId });
        setWishlist(prev => [...prev, carId]);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Failed to update wishlist. Please login.");
    }
  };

  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase());

    let matchesBrand = true;
    if (selectedBrand) {
      if (selectedBrand === "Suzuki") {
        matchesBrand = car.name.toLowerCase().includes("maruti") || car.name.toLowerCase().includes("suzuki");
      } else if (selectedBrand === "Benz") {
        matchesBrand = car.name.toLowerCase().includes("mercedes") || car.name.toLowerCase().includes("benz");
      } else {
        matchesBrand = car.name.toLowerCase().includes(selectedBrand.toLowerCase());
      }
    }

    return matchesSearch && matchesBrand;
  });

  const clearBrandFilter = () => {
    setSelectedBrand("");
  };

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff" }}>

      <div
        className="relative bg-cover bg-center py-20 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url('https://wallpapercave.com/wp/wp9116949.jpg')`,
        }}
      >
        <div className="max-w-5xl mx-auto bg-[#1b1b1b]/90 rounded-xl overflow-hidden shadow-2xl p-8 sm:p-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-white">
            Find Your Perfect Used Car
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <input
              type="text"
              placeholder="Search by model, brand, or keyword"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-4 flex-1 rounded-md border-none text-base outline-none bg-[#2b2b2b] text-white shadow-inner focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleSearch}
              className="bg-[#ff2d2d] text-white py-4 px-8 rounded-md font-bold text-base hover:scale-105 transition-transform"
            >
              SEARCH
            </button>
          </div>
          {selectedBrand && (
            <div className="mt-2 text-[#ff2d2d] flex items-center justify-center gap-2">
              <span>Filtering by: {selectedBrand}</span>
              <button
                onClick={clearBrandFilter}
                className="bg-transparent border border-[#ff2d2d] text-[#ff2d2d] rounded px-2 py-0.5 hover:bg-[#ff2d2d] hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h2 className="text-3xl font-bold mb-8 text-[#ff2d2d]">
          Choose Your Favorite Brand
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {carBrands.map((brand) => (
            <div
              key={brand.name}
              onClick={() => setSelectedBrand(brand.name)}
              className={`cursor-pointer p-4 rounded-xl transition-all duration-200 flex flex-col items-center gap-3 w-28 hover:scale-105 ${selectedBrand === brand.name ? "bg-[#ff2d2d]" : "bg-[#2b2b2b]"
                }`}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className={`w-16 h-16 object-contain transition-all duration-200 ${selectedBrand === brand.name ? "brightness-100" : "brightness-75"
                  }`}
              />
              <span className="text-white font-bold">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2
          ref={resultsRef}
          className="text-3xl font-bold mb-8 text-[#ff2d2d] text-center"
        >
          {selectedBrand ? `${selectedBrand} Cars` : "Popular Cars"}
        </h2>

        {filteredCars.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">No cars found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(search || selectedBrand ? filteredCars : filteredCars.slice(0, 8)).map((car) => (
              <div
                key={car._id || car.id}
                onClick={() => navigate(`/products/${car._id || car.id}`)}
                className="bg-[#1b1b1b] rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-200 hover:scale-105 relative group"
              >
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={(e) => toggleWishlist(e, car._id || car.id)}
                  className={`absolute top-2 right-2 border-none bg-black/50 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${wishlist.includes(car._id || car.id) ? "text-[#ff2d2d]" : "text-white"
                    }`}
                >
                  {wishlist.includes(car._id || car.id) ? <FaHeart /> : <FaRegHeart />}
                </button>

                <div className="p-4 text-left">
                  <h3 className="text-[#ff2d2d] text-lg font-bold mb-2 truncate">
                    {car.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-1">Price: ₹{car.price.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs mb-1">KM: {car.km}</p>
                  <p className="text-gray-400 text-xs mb-3">Fuel: {car.fuel}</p>
                  <div className="flex gap-2 mt-auto">
                    {car.stock > 0 ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
                            if (!loggedInUser) return toast.error("Please login to add to cart");
                            api.post('/cart', { productId: car._id || car.id, quantity: 1 })
                              .then(() => toast.success("Added to cart"))
                              .catch(err => {
                                if (err.response?.status === 400) {
                                  toast.info("Already added in cart");
                                } else {
                                  toast.error(err.response?.data?.message || "Failed to add");
                                }
                              });
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm flex-1 font-medium transition-colors"
                        >
                          Cart
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
                            if (!loggedInUser) return toast.error("Please login to buy");
                            api.post('/cart', { productId: car._id || car.id, quantity: 1 })
                              .then(() => {
                                window.location.href = '/payment';
                              })
                              .catch(err => {
                                if (err.response?.status === 400) {
                                  toast.info("Already in cart. Redirecting to payment...");
                                  setTimeout(() => {
                                    window.location.href = '/payment';
                                  }, 1000);
                                } else {
                                  toast.error(err.response?.data?.message || "Failed to buy");
                                }
                              });
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm flex-1 font-medium transition-colors"
                        >
                          Buy Now
                        </button>
                      </>
                    ) : (
                      <button disabled className="bg-gray-600 text-white cursor-not-allowed px-3 py-1.5 rounded text-sm w-full font-bold opacity-70">
                        Sold Out
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div >
  );
}

