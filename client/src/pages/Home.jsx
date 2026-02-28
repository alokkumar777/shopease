import { useState, useEffect } from "react";
import { getAllProducts } from "../services/productService";
import { addToCart } from "../services/cartService";
import { useCart } from "../context/CartContext";
import ToastMessage from "../components/ToastMessage";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const { fetchCartCount } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setToast({
          show: true,
          message: "Failed to load products",
          type: "danger",
        });
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    setLoadingId(productId);
    try {
      await addToCart(productId);
      await fetchCartCount();
      setToast({
        show: true,
        message: "Product added to cart!",
        type: "success",
      });
    } catch (error) {
      console.error("Could not add to cart:", error);
      setToast({
        show: true,
        message: "Could not add to cart. Please login.",
        type: "danger",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="page-enter">
      <ToastMessage
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <h1 className="mb-5 text-center">Featured Products</h1>

      <div className="row g-3 g-md-4">
        {products.map((p) => (
          <div key={p.id} className="col-6 col-md-6 col-lg-4 mb-3 mb-md-4">
            <div className="card h-100 shadow-sm card-hover">
              {p.image && (
                <img
                  src={`${p.image}`}
                  alt={p.name}
                  className="card-img-top product-image"
                />
              )}
              <div className="card-body d-flex flex-column p-2 p-md-3">
                <h5 className="card-title mb-2">{p.name}</h5>
                <p className="card-text text-muted flex-grow-1 text-truncate-3 d-none d-md-block">
                  {p.description}
                </p>
                <div className="mt-auto">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-2 mb-md-3">
                    <span className="h5 mb-1 mb-md-0 text-primary">₹{p.price}</span>
                    <span className="badge bg-light text-dark border d-none d-sm-inline-block">
                      Free Delivery
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(p.id)}
                    disabled={loadingId === p.id}
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center btn-sm-mobile"
                  >
                    {loadingId === p.id ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Adding...
                      </>
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && !toast.show && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-3 text-muted">Loading products...</p>
        </div>
      )}
      {products.length === 0 && toast.show && toast.type === "danger" && (
        <div className="text-center py-5">
          <p className="text-danger">
            Failed to load products. Please refresh the page.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
