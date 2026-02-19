import { useState, useEffect } from "react";
import { getAllProducts } from "../services/productService";

function Home() {
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
		
		fetchProducts();
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