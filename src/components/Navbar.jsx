import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
export default function Navbar() {
  const navLinks = ["Home", "Products", "Wishlist", "Cart", "Orders"];
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkUser = () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      setUser(loggedInUser);
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    const handleUserChange = () => checkUser();
    window.addEventListener("userChanged", handleUserChange);
    window.addEventListener("customStorageChange", checkUser);
    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("userChanged", handleUserChange);
      window.removeEventListener("customStorageChange", checkUser);
    };
  }, []);
  const handleLogout = () => {
    if (user) {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem(`cart_${user.id}`);
      localStorage.removeItem(`wishlist_${user.id}`);
      window.dispatchEvent(new Event("customStorageChange"));
    }
    setUser(null);
    window.dispatchEvent(new Event("userChanged"));
    navigate("/register");
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };
  const animateText = (text) =>
    text.split("").map((char, index) => (
      <span key={index} style={{ display: "inline-block" }}>
        {char}
      </span>
    ));
  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-[#2b2b2b] shadow-md sticky top-0 z-50">
      <Link to="/" className="no-underline flex items-center">
        <h2 className="text-3xl m-0 text-[#ff2d2d] font-bold">
          Opscart.in
        </h2>
      </Link>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden bg-transparent border-none text-white text-2xl cursor-pointer"
      >
        {isMenuOpen ? "✕" : "☰"}
      </button>
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link, index) => (
          <Link key={index} to={`/${link.toLowerCase()}`} className="text-white no-underline font-medium text-base cursor-pointer hover:text-[#ff2d2d] transition-colors duration-300">
            {animateText(link)}
          </Link>
        ))}
        {user ? (
          <div className="relative flex items-center gap-4">
            <div
              onClick={toggleProfileMenu}
              className="w-9 h-9 rounded-full bg-[#ff2d2d] text-white flex justify-center items-center font-bold cursor-pointer overflow-hidden"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            {isProfileOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 bg-[#2b2b2b] border border-[#444] rounded-lg overflow-hidden z-[100] w-48">
                <div className="px-5 py-2.5 border-b border-[#444] text-white">
                  Hi, {user.name || user.email}
                </div>
                <button
                  onClick={() => { navigate("/profile"); setIsProfileOpen(false); }}
                  className="w-full text-left px-5 py-2.5 bg-transparent text-white border-none cursor-pointer hover:bg-[#444] transition-colors duration-300"
                >
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-2.5 bg-transparent text-[#ff2d2d] border-none cursor-pointer hover:bg-[#444] transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-transparent text-[#ff2d2d] border-2 border-[#ff2d2d] rounded-md no-underline font-medium text-base transition-colors duration-300 hover:bg-[#ff2d2d] hover:text-white"
          >
            Login
          </Link>
        )}
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#2b2b2b] p-5 shadow-lg flex flex-col gap-4 z-[99]">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={`/${link.toLowerCase()}`}
              className="text-white no-underline font-medium text-base py-2.5 hover:text-[#ff2d2d] transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {animateText(link)}
            </Link>
          ))}
          {user ? (
            <>
              <div className="text-white text-sm py-2.5 border-t border-[#444] mt-2.5">
                Welcome, {user.name || user.email}
              </div>
              <Link
                to="/profile"
                className="text-white no-underline font-medium text-base py-2.5 border-b border-[#333] hover:text-[#ff2d2d] transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-center px-4 py-2 bg-transparent text-[#ff2d2d] border-2 border-[#ff2d2d] rounded-md font-medium text-base transition-colors duration-300 hover:bg-[#ff2d2d] hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="w-full text-center px-4 py-2 bg-transparent text-[#ff2d2d] border-2 border-[#ff2d2d] rounded-md font-medium text-base transition-colors duration-300 hover:bg-[#ff2d2d] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav> 
  );
}
