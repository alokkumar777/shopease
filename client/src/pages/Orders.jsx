import React, { useEffect, useState } from "react";
import orderService from "../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Order History</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info">No orders yet.</div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Order #{order.id}</h5>
                <span
                  className={`badge ${
                    order.status === "completed"
                      ? "bg-success"
                      : order.status === "pending"
                      ? "bg-warning text-dark"
                      : "bg-secondary"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              <p className="text-muted small">
                Placed on: {new Date(order.created_at).toLocaleString()}
              </p>

              <ul className="list-group mb-3">
                {order.order_items.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{item.product.name}</strong>
                      <div className="text-muted small">Qty: {item.quantity}</div>
                    </div>
                    <span className="fw-bold">
                      ₹{item.price_at_purchase * item.quantity}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="text-end fw-bold fs-5">
                Total: ₹{order.total_price}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
