
import React, { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [popupType, setPopupType] = useState("");

  useEffect(() => {
    const loadUserWishlist = () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      setUser(loggedInUser);

      if (loggedInUser) {
        const storedWishlist = JSON.parse(localStorage.getItem(`wishlist_${loggedInUser.id}`)) || [];
        setWishlist(storedWishlist);
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

  useEffect(() => {
    if (user) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToWishlist = (product) => {
    if (!wishlist.some((item) => item.id === product.id)) {
      const updated = [...wishlist, product];
      setWishlist(updated);

      setPopupProduct(product);
      setPopupType("add");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  const removeFromWishlist = (id) => {
    const product = wishlist.find((item) => item.id === id);
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);

    if (product) {
      setPopupProduct(product);
      setPopupType("remove");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
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
    const loadUserCart = () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      setUser(loggedInUser);

      if (loggedInUser) {
        const storedCart = JSON.parse(localStorage.getItem(`cart_${loggedInUser.id}`)) || [];
        setCart(storedCart);
      } else {
        setCart([]);
      }
    };

    loadUserCart();

    window.addEventListener("userChanged", loadUserCart);
    return () => {
      window.removeEventListener("userChanged", loadUserCart);
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product) => {
    if (!cart.some((item) => item.id === product.id)) {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));

     
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950">
        <h2 className="text-3xl font-extrabold tracking-wide text-red-500 drop-shadow-lg">
          🚗 Your Wishlist is Empty
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
          {wishlist.map((item) => (
            <div
              key={item.id}
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
                  onClick={() => removeFromWishlist(item.id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg w-full font-semibold transition duration-300"
                >
                  Remove ❌
                </button>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg w-full font-semibold transition duration-300"
                >
                  Add to Cart ✅
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <WishlistPopup />
    </div>
  );
}

export const useWishlist = () => useContext(WishlistContext);
