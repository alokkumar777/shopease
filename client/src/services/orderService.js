import api from "./api";

const getOrders = async () => {
  const response = await api.get("/orders/");
  return response.data;
};

const orderService = {
  getOrders,
};

export default orderService;
