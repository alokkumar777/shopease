import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow mb-4">
      <div className="container py-1">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          ShopEase
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item px-2">
              <Link className={`nav-link ${isActive("/")}`} to="/">
                Home
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item px-2">
                  <Link
                    className={`nav-link ${isActive("/orders")}`}
                    to="/orders"
                  >
                    Orders
                  </Link>
                </li>
                <li className="nav-item px-2">
                  <Link
                    className={`nav-link ${isActive("/cart")} position-relative`}
                    to="/cart"
                  >
                    <span className="me-1">Cart</span>
                    {cartCount > 0 && (
                      <span
                        className="badge rounded-pill bg-danger"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="nav-item ms-lg-3">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm rounded-pill px-4"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/login")}`} to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
