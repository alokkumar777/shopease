import { useState, useEffect } from "react";
import api from "../services/api";
import { checkout } from "../services/cartService";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: "", text: "" });
  const { fetchCartCount } = useCart();

  const fetchCart = async () => {
    try {
      const response = await api.get("orders/cart/");
      setCart(response.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setAlertMsg({ type: "danger", text: "Failed to load cart items." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (!window.confirm("Are you sure you want to complete your purchase?"))
      return;

    setIsCheckingOut(true);
    setAlertMsg({ type: "", text: "" });
    try {
      await checkout();
      setAlertMsg({ type: "success", text: "Order placed successfully!" });
      await fetchCartCount();
      await fetchCart();
    } catch (err) {
      console.error("Checkout failed:", err);
      setAlertMsg({ type: "danger", text: "Checkout failed. Please try again." });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items
      .reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0)
      .toFixed(2);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading your cart...</span>
        </div>
        <p className="mt-2 text-muted">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container mb-5">
      <h2 className="mb-4 fw-bold">Your Shopping Cart</h2>

      {alertMsg.text && (
        <div className={`alert alert-${alertMsg.type} alert-dismissible fade show`} role="alert">
          {alertMsg.text}
          <button type="button" className="btn-close" onClick={() => setAlertMsg({ type: "", text: "" })}></button>
        </div>
      )}

      {!cart || cart.items?.length === 0 ? (
        <div className="text-center py-5 bg-light rounded shadow-sm">
          <p className="mb-0 text-muted">Your cart is empty.</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            <div className="card shadow-sm border-0 rounded">
              <div className="list-group list-group-flush">
                {cart.items.map((item) => (
                  <div key={item.id} className="list-group-item p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1 fw-bold">{item.product.name}</h5>
                        <p className="text-muted mb-0 small">Price: ₹{item.product.price}</p>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-light text-dark border p-2 mb-2 d-block">Qty: {item.quantity}</span>
                        <strong className="text-primary d-block">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-4 mt-md-0">
            <div className="card shadow-sm border-0 rounded sticky-top" style={{ top: "1rem" }}>
              <div className="card-body p-4">
                <h4 className="card-title mb-4 fw-bold">Order Summary</h4>
                <div className="d-flex justify-content-between mb-3 h5">
                  <span className="text-muted">Total</span>
                  <span className="fw-bold">₹{calculateTotal()}</span>
                </div>
                <hr />
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="btn btn-success w-100 py-3 fw-bold d-flex align-items-center justify-content-center"
                >
                  {isCheckingOut ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    "Confirm Purchase"
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
