import { useState, useEffect } from "react";
import { getAllProducts } from "../services/productService";
import api from "../services/api";
import { addToCart } from "../services/cartService";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
				const data = await getAllProducts();
				// console.log("API Data:", data);
        setProducts(data);
			} catch (err) {
				alert("Failed to load products");
      }
    };
    // const fetchCart = async () => {
    //   try {
    //     const response = await api.get("orders/cart/");
    //     console.log("Cart Data:", response.data);
    //   } catch (error) {
    //     console.log("Cart Error:", error.response?.data || error.message);
    //   }
    // };
		
    fetchProducts();
    // fetchCart();
  }, []);
  
  const handleAddToCart = async (productId) => {
    setLoadingId(productId);
    try {
      await addToCart(productId);
      alert("Add to cart successfully!")
    } catch (error) {
      alert("Could not add to cart. Are you logged in?");
    } finally {
      setLoadingId(null);
    }
  }
	
	return (
    <div>
      <h1>Product List</h1>
      {products.map((p) => (
        <div key={p.id}>
          {/* <img src={p.image} alt={p.name} width="150" /> */}
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <span>${p.price}</span>
          <button
            onClick={() => handleAddToCart(p.id)}
            disabled={loadingId === p.id}
          >
            {loadingId === p.id ? "Adding..." : "Add to cart"}
          </button>
					<hr />
        </div>
      ))}
    </div>
  );
}

export default Home;