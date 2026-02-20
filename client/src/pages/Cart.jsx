import { useState, useEffect } from "react";
import api from "../services/api";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("orders/cart/");
        setCart(response.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;

    return cart.items
      .reduce((acc, item) => {
        return acc + Number(item.product.price) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  if (loading) return <p>Loading your cart...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Shopping Cart</h1>

      {!cart || cart.items?.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div
                key={item.id}
                style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}
              >
                <h4>{item.product.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <div>
                  <p>price: {item.product.price}</p>
                  <strong>
                    <p>
                      Subtotal: ₹
                      {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </strong>
                </div>
              </div>
            ))}
          </div>

          <hr />

          <div style={{ marginTop: "20px" }}>
            <h3>Total: ₹{calculateTotal()}</h3>
            <button
              style={{
                padding: "10px 20px",
                background: "green",
                color: "white",
                border: "none",
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
