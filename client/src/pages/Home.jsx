import { useState, useEffect } from "react";
import { getAllProducts } from "../services/productService";
import api from "../services/api";

const Home = () => {
  const [products, setProducts] = useState([]);

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
	
	return (
    <div>
      <h1>Product List</h1>
      {products.map((p) => (
        <div key={p.id}>
          {/* <img src={p.image} alt={p.name} width="150" /> */}
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <span>${p.price}</span>
					<button>Add to Cart</button>
					<hr />
        </div>
      ))}
    </div>
  );
}

export default Home;