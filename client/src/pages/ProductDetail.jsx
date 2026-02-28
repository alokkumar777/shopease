import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import { useCart } from "../context/CartContext";
import ToastMessage from "../components/ToastMessage";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const { fetchCartCount } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product:", err);
        setToast({
          show: true,
          message: "Failed to load product details",
          type: "danger",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart(product.id);
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
      setAddingToCart(null);
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-danger">Product Not Found</h2>
        <p className="text-muted">The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4 page-enter">
      <ToastMessage
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-transparent p-0 mb-4">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <button onClick={() => navigate(-1)} className="btn btn-outline-secondary btn-sm mb-4">
        &larr; Back
      </button>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            {product.image ? (
              <img
                src={product.image.startsWith('http') ? product.image : `https://shopease-ur52.onrender.com${product.image}`}
                alt={product.name}
                className="img-fluid rounded shadow-sm w-100"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
            ) : (
              <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                <span className="text-muted">No Image Available</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="ps-md-4">
            <h1 className="display-5 fw-bold mb-3">{product.name}</h1>
            
            <div className="mb-4">
              <span className="h2 text-primary fw-bold">₹{product.price}</span>
            </div>

            <div className="mb-4">
              {product.stock > 0 ? (
                <span className="badge bg-success-subtle text-success px-3 py-2 border border-success">
                  <i className="bi bi-check-circle-fill me-1"></i> In Stock
                </span>
              ) : (
                <span className="badge bg-danger-subtle text-danger px-3 py-2 border border-danger">
                  <i className="bi bi-x-circle-fill me-1"></i> Out of Stock
                </span>
              )}
            </div>

            <div className="mb-4">
              <h5 className="fw-bold border-bottom pb-2">Description</h5>
              <p className="text-muted" style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {product.description}
              </p>
            </div>

            <div className="d-grid gap-2 mt-5">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock <= 0}
                className="btn btn-primary btn-lg d-flex align-items-center justify-content-center py-3"
              >
                {addingToCart ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <i className="bi bi-cart-plus-fill me-2"></i>
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 p-3 bg-light rounded border">
              <div className="d-flex align-items-center text-muted mb-2">
                <i className="bi bi-truck me-2"></i>
                <span>Free delivery on orders over ₹500</span>
              </div>
              <div className="d-flex align-items-center text-muted">
                <i className="bi bi-shield-check me-2"></i>
                <span>100% Genuine Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
