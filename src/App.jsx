
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Order from "./pages/Order";
import Wishlist, { WishlistProvider } from "./pages/wishlist";

import Login from "./Auth/Login";
import Register from "./Auth/Register";

import AdminDashboard from "./admin/AdminDashboard";
import ManageProducts from "./admin/ManageProducts";
import ManageOrders from "./admin/ManageOrders";
import ManageUser from "./admin/ManageUser";
import AdminPanelLayout from "./admin/AdminPanelLayout";
import AdminRoute from "./AdminRoute";
import EditProduct from "./admin/EditProduct";
import ProductView from "./admin/ProductView";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRouteWrapper({ children }) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  return user && user.isAdmin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <WishlistProvider>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {!isAdminPath && <Navbar />}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Order />
                </PrivateRoute>
              }
            />

        
            <Route
              path="/admin/dashboard"
              element={
                <AdminRouteWrapper>
                  <AdminPanelLayout>
                    <AdminDashboard />
                  </AdminPanelLayout>
                </AdminRouteWrapper>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRouteWrapper>
                  <AdminPanelLayout>
                    <ManageProducts />
                  </AdminPanelLayout>
                </AdminRouteWrapper>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <AdminRouteWrapper>
                  <AdminPanelLayout>
                    <EditProduct />
                  </AdminPanelLayout>
                </AdminRouteWrapper>
              }
            />
            <Route
              path="/admin/products/view/:id" 
              element={
                <AdminRouteWrapper>
                  <AdminPanelLayout>
                    <ProductView />
                  </AdminPanelLayout>
                </AdminRouteWrapper>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRouteWrapper>
                  <AdminPanelLayout>
                    <ManageOrders />
                  </AdminPanelLayout>
                </AdminRouteWrapper>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRouteWrapper>
                  <AdminPanelLayout>
                    <ManageUser />
                  </AdminPanelLayout>
                </AdminRouteWrapper>
              }
            />
          </Routes>
        </main>
        {!isAdminPath && <Footer />}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            backgroundColor: "#1f1f1f",
            color: "#fff",
            border: "1px solid #ef4444",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "600",
            padding: "12px 16px",
            boxShadow: "0px 4px 15px rgba(239, 68, 68, 0.5)",
          }}
          progressStyle={{
            background: "#ef4444",
          }}
        />
      </div>
    </WishlistProvider>
  );
}
