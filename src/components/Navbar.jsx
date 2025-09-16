
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navLinks = ["Home", "Products", "Wishlist", "Cart", "Orders"];
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  };

  const animateText = (text) =>
    text.split("").map((char, index) => (
      <span key={index} style={{ display: "inline-block" }}>
        {char}
      </span>
    ));

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        background: "#2b2b2bff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
        <h2
          style={{
            fontSize: "30px",
            margin: 0,
            color: "#ff2d2d",
            fontWeight: "bold",
          }}
        >
          Opscart.in
        </h2>
      </Link>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{
          display: "none",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "24px",
          cursor: "pointer",
        }}
        className="mobile-menu-btn"
      >
        {isMenuOpen ? "✕" : "☰"}
      </button>

      <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {navLinks.map((link, index) => (
          <Link key={index} to={`/${link.toLowerCase()}`} style={navLinkStyle} className="nav-link">
            {animateText(link)}
          </Link>
        ))}

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ color: "#fff", fontSize: "14px" }} className="welcome-text">
              Welcome, {user.name || user.email}
            </span>
            <button
              onClick={handleLogout}
              style={loginButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ff2d2d";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#ff2d2d";
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={loginButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ff2d2d";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#ff2d2d";
            }}
          >
            Login
          </Link>
        )}
      </div>

      {isMenuOpen && (
        <div
          className="mobile-nav"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#2b2b2bff",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            zIndex: 99,
          }}
        >
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={`/${link.toLowerCase()}`}
              style={{ ...navLinkStyle, padding: "10px 0" }}
              onClick={() => setIsMenuOpen(false)}
            >
              {animateText(link)}
            </Link>
          ))}

          {user ? (
            <>
              <div
                style={{
                  color: "#fff",
                  fontSize: "14px",
                  padding: "10px 0",
                  borderTop: "1px solid #444",
                  marginTop: "10px",
                }}
              >
                Welcome, {user.name || user.email}
              </div>
              <button
                onClick={handleLogout}
                style={{ ...loginButtonStyle, width: "100%", textAlign: "center" }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              style={{ ...loginButtonStyle, width: "100%", textAlign: "center" }}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}

      <style>
        {`
          @media (max-width: 768px) {
            .desktop-nav {
              display: none !important;
            }
            
            .mobile-menu-btn {
              display: block !important;
            }
            
            .welcome-text {
              display: none;
            }
          }
          
          @media (min-width: 769px) {
            .mobile-nav {
              display: none !important;
            }
            
            .mobile-menu-btn {
              display: none !important;
            }
          }
        `}
      </style>
    </nav>
  );
}

const navLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "16px",
  cursor: "pointer",
  display: "inline-block",
  overflow: "hidden",
  transition: "all 0.3s ease",
};

const loginButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "transparent",
  color: "#ff2d2d",
  border: "2px solid #ff2d2d",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "16px",
  transition: "all 0.3s",
  cursor: "pointer",
};
