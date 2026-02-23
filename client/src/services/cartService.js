import api from "./api";

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post("orders/cart/", {
      product_id: productId,
      quantity: quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Cart API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const checkout = async () => {
  try {
    const response = await api.post("orders/checkout/");
    return response.data;
  } catch (error) {
    console.error("Checkout Error:", error.response?.data || error.message);
    throw error;
  }
};