import axios from "axios"

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * PLACEHOLDER FOR JWT INTERCEPTOR
 * We will come back here later to add:
 * api.interceptors.request.use((config) => { ... })
 */

export default api;