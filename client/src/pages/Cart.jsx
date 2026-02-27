import { useState, useEffect } from "react";
import api from "../services/api";
import { checkout, removeFromCart } from "../services/cartService";
import { useCart } from "../context/CartContext";
import ToastMessage from "../components/ToastMessage";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const { fetchCartCount } = useCart();

  const fetchCart = async () => {
    try {
      const response = await api.get("orders/cart/");
      setCart(response.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setToast({
        show: true,
        message: "Failed to load cart items.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      setToast({
        show: true,
        message: "Item removed from cart.",
        type: "info",
      });
      await fetchCartCount();
      await fetchCart();
    } catch (err) {
      console.error("Remove failed:", err);
      setToast({
        show: true,
        message: "Failed to remove item. Please try again.",
        type: "danger",
      });
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      await checkout();
      setToast({
        show: true,
        message: "Order placed successfully!",
        type: "success",
      });
      await fetchCartCount();
      await fetchCart();
    } catch (err) {
      console.error("Checkout failed:", err);
      setToast({
        show: true,
        message: "Checkout failed. Please try again.",
        type: "danger",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items
      .reduce(
        (acc, item) => acc + Number(item.product.price) * item.quantity,
        0,
      )
      .toFixed(2);
  };

  if (loading) {
    return (
      <div className="text-center py-5 page-enter">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container mb-5 page-enter">
      <ToastMessage
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <h2 className="mb-4">Shopping Cart</h2>

      {!cart || cart.items?.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted mb-3">Your cart is empty</h4>
          <p className="text-muted">
            Looks like you haven't added anything to your cart yet.
          </p>
          <a href="/" className="btn btn-primary mt-3">
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm mb-4">
              <div className="list-group list-group-flush">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="list-group-item p-4 border-0 border-bottom"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        {item.product.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="rounded me-3 shadow-sm"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <div>
                          <h5 className="mb-1">{item.product.name}</h5>
                          <p className="text-muted small mb-0">
                            Unit Price: ₹{item.product.price}
                          </p>
                          <button
                            className="btn btn-link btn-sm text-danger p-0 mt-2 text-decoration-none"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="badge bg-light text-dark border mb-2">
                          Qty: {item.quantity}
                        </div>
                        <h6 className="mb-0 text-primary fw-bold">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="card shadow-sm rounded-3 border-0 sticky-top"
              style={{ top: "2rem" }}
            >
              <div className="card-body p-4">
                <h5 className="card-title mb-4">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span className="text-success">FREE</span>
                </div>
                <hr className="my-4" />
                <div className="d-flex justify-content-between mb-4">
                  <span className="h5 mb-0">Total</span>
                  <span className="h5 mb-0 fw-bold text-primary">
                    ₹{calculateTotal()}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="btn btn-primary btn-lg w-100 py-3 d-flex align-items-center justify-content-center"
                >
                  {isCheckingOut ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Processing...
                    </>
                  ) : (
                    "Checkout Now"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
