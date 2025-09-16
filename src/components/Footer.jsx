
import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1f1f1f",
        color: "#fff",
        padding: "30px 20px",
        textAlign: "center",
        width: "100vw",
        height: "200px", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center",     
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.3)",
        marginTop: "-40px", 
      }}
    >
      <h2 style={{ margin: "0 0 10px", fontWeight: "600" }}>CarResale</h2>
      <p style={{ margin: "0 0 10px", fontSize: "14px", color: "#bbb" }}>
        Your trusted place to buy & sell cars
      </p>
      <p style={{ fontSize: "12px", color: "#888" }}>
        &copy; {new Date().getFullYear()} CarResale. All rights reserved.
      </p>
    </footer>
  );
}
