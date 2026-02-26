import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import { addToCart } from "../services/cartService";
import { useCart } from "../context/CartContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [alertMsg, setAlertMsg] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setAlertMsg({ type: "danger", text: "Failed to load products" });
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    setLoadingId(productId);
    setAlertMsg({ type: "", text: "" });
    try {
      await addToCart(productId);
      await fetchCartCount();
      navigate("/cart");
    } catch (error) {
      console.error("Could not add to cart:", error);
      setAlertMsg({ type: "danger", text: "Could not add to cart. Are you logged in?" });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-center">Featured Products</h1>
      
      {alertMsg.text && (
        <div className={`alert alert-${alertMsg.type} alert-dismissible fade show`} role="alert">
          {alertMsg.text}
          <button type="button" className="btn-close" onClick={() => setAlertMsg({ type: "", text: "" })}></button>
        </div>
      )}

      <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-md-4 col-sm-6 mb-4">
            <div className="card h-100 shadow-sm border-0 rounded">
              {p.image && (
                <img
                  src={`${p.image}`}
                  alt={p.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{p.name}</h5>
                <p className="card-text text-muted flex-grow-1">{p.description}</p>
                <div className="mt-3">
                  <span className="h5 fw-bold text-primary">₹{p.price}</span>
                  <button
                    onClick={() => handleAddToCart(p.id)}
                    disabled={loadingId === p.id}
                    className="btn btn-primary w-100 mt-3 d-flex align-items-center justify-content-center"
                  >
                    {loadingId === p.id ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : (
                      "Add to cart"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center text-muted">No products available.</p>
      )}
    </div>
  );
};

export default Home;
