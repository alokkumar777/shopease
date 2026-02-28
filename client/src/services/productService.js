import api from "./api";

// *Fetches all products from the backend.
// *Path: http://127.0.0.1:8000/api/products/

export const getAllProducts = async () => {
    try {
        const response = await api.get("products/");
        return response.data;
    } catch (error) {
        console.error("Error fetching products", error);
        throw error;
    }
}

export const getProductById = async (id) => {
    try {
        const response = await api.get(`products/${id}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with ID ${id}`, error);
        throw error;
    }
}
