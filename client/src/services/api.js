import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

//  * PLACEHOLDER FOR JWT INTERCEPTOR
//  * We will come back here later to add:
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    // console.log("Interceptor token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;