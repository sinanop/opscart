
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [popupType, setPopupType] = useState("");

  useEffect(() => {
    const loadUserWishlist = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      setUser(loggedInUser);

      if (loggedInUser) {
        try {
          const { data } = await api.get('/wishlist');
         
          setWishlist(data.products || []);
        } catch (error) {
          console.error("Error loading wishlist", error);
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    };

    loadUserWishlist();
    window.addEventListener("userChanged", loadUserWishlist);
    return () => {
      window.removeEventListener("userChanged", loadUserWishlist);
    };
  }, []);

  const addToWishlist = async (product) => {
    try {
      const response = await api.post('/wishlist', { productId: product._id || product.id });

  
      if (response.data && response.data.products) {
        setWishlist(response.data.products);
      }

      setPopupProduct(product);
      setPopupType("add");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("Error adding to wishlist", error);
      toast.error("Could not add to wishlist");
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      const response = await api.delete(`/wishlist/${id}`);

      const product = wishlist.find((item) => item.id === id || item._id === id);

      if (response.data && response.data.products) {
        setWishlist(response.data.products);
      } else {
        const updated = wishlist.filter((item) => item.id !== id && item._id !== id);
        setWishlist(updated);
      }

      if (product) {
        setPopupProduct(product);
        setPopupType("remove");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      }
    } catch (error) {
      console.error("Error removing from wishlist", error);
      toast.error("Could not remove from wishlist");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        showPopup,
        popupProduct,
        popupType,
        setShowPopup,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function WishlistPopup() {
  const { showPopup, popupProduct, popupType } = useContext(WishlistContext);

  if (!showPopup) return null;

  const actionText = popupType === "add" ? "added to wishlist!" : "removed from wishlist!";

  return (
    <div
      className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300"
      style={{ animation: "fadeInOut 3s forwards" }}
    >
      <div className="flex items-center">
        <span className="text-xl mr-2">✓</span>
        <span>{popupProduct?.name} {actionText}</span>
      </div>
    </div>
  );
}

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(loggedInUser);
  }, []);

  const addToCart = async (product) => {
    try {
      await api.post('/cart', { productId: product._id || product.id, quantity: 1 });
      toast.success("Added to cart!");
  
    } catch (error) {
      console.error("Error adding to cart", error);
      toast.error("Failed to add to cart");
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950">
        <h2 className="text-3xl font-extrabold tracking-wide text-red-500 drop-shadow-lg">
          Your Wishlist is Empty
        </h2>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-black via-gray-900 to-red-950">
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-red-500 mb-8 text-center drop-shadow-lg">
          Your Wishlist
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            if (!item) return null;
            return (
              <div
                key={item._id || item.id}
                className="bg-gradient-to-br from-black/90 to-gray-900 border border-red-700 rounded-xl shadow-lg p-4 text-white"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-bold text-red-400">{item.name}</h2>
                <p className="text-gray-300">Price: ₹{item.price}</p>
                <p className="text-gray-300">KM: {item.km}</p>
                <p className="text-gray-300">Fuel: {item.fuel}</p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => removeFromWishlist(item._id || item.id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg w-full font-semibold transition duration-300"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg w-full font-semibold transition duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <WishlistPopup />
    </div>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {

    return {
      wishlist: [],
      addToWishlist: () => console.warn("WishlistProvider missing"),
      removeFromWishlist: () => console.warn("WishlistProvider missing"),
      showPopup: false,
      popupProduct: null,
      popupType: "",
      setShowPopup: () => { },
    };
  }
  return context;
};
