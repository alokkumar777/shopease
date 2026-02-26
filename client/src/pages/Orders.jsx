import React, { useEffect, useState } from "react";
import orderService from "../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [now, setNow] = useState(Date.now());

  // Update "now" every 10 seconds to refresh simulated statuses
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(interval);
  }, []);

  const getSimulatedStatus = (order) => {
    const createdTime = new Date(order.created_at).getTime();
    const elapsedSeconds = (now - createdTime) / 1000;

    if (elapsedSeconds < 30) {
      return { label: "PENDING", class: "bg-warning text-dark" };
    } else if (elapsedSeconds < 120) {
      return { label: "OUT FOR DELIVERY", class: "bg-info text-white" };
    } else {
      return { label: "DELIVERED", class: "bg-success" };
    }
  };

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
    <div className="container mt-5 page-enter">
      <h2 className="mb-4">Order History</h2>
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted mb-3">No orders yet</h4>
          <p className="text-muted">You haven't placed any orders yet.</p>
          <a href="/" className="btn btn-primary mt-2">
            Browse Products
          </a>
        </div>
      ) : (
        <>
          {orders.slice(0, visibleCount).map((order) => (
            <div
              key={order.id}
              className="card mb-4 shadow-sm card-hover overflow-hidden"
            >
              <div className="card-header bg-white py-3 border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1 small">ORDER ID</h6>
                    <h5 className="mb-0">#{order.id}</h5>
                  </div>
                  <div className="text-end">
                    <h6 className="text-muted mb-1 small">STATUS</h6>
                    {(() => {
                      const status = getSimulatedStatus(order);
                      return (
                        <span
                          className={`badge rounded-pill px-3 py-2 ${status.class}`}
                        >
                          {status.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="px-4 py-2 bg-light small text-muted">
                  Placed on: {new Date(order.created_at).toLocaleString()}
                </div>
                <ul className="list-group list-group-flush">
                  {order.order_items.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center py-3 border-0 border-bottom mx-3 px-0"
                    >
                      <div className="d-flex align-items-center">
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="rounded me-3 shadow-sm"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <div>
                          <h6 className="mb-0">
                            {item.product?.name || "Product Unavailable"}
                          </h6>
                          <div className="text-muted small">
                            Qty: {item.quantity} x ₹{item.price_at_purchase}
                          </div>
                        </div>
                      </div>
                      <span className="fw-bold">
                        ₹{item.price_at_purchase * item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-footer bg-white py-3 border-0 text-end">
                <span className="text-muted me-2">Grand Total:</span>
                <span className="h4 mb-0 text-primary fw-bold">
                  ₹{order.total_price}
                </span>
              </div>
            </div>
          ))}

          {visibleCount < orders.length && (
            <div className="text-center mt-4 mb-5">
              <button
                className="btn btn-outline-primary px-5 py-2 shadow-sm fw-bold"
                onClick={() => setVisibleCount((prev) => prev + 3)}
              >
                Load More Orders
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
