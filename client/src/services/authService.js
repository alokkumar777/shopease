import api from "./api";

// *Sends credentials to get JWT tokens.
// *Endpoint: http://127.0.0.1:8000/api/token/

export const login = async (username, password) => {
	try {
		const response = await api.post("token/", { username, password });
		return response.data
	} catch (error) {
		console.error("Login error:", error.response?.data || error.message);
		throw error;
	}
};

// * Register new user
// * Endpoint: http://127.0.0.1:8000/api/users/register/

export const register = async (userData) => {
	try {
		const response = await api.post("users/register/", userData);
		return response.data
	} catch (error) {
		console.error("Registration Error:", error.response?.data || error.message);
		throw error;
	}
};

