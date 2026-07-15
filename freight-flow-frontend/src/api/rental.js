import client from "./client";

// Products (CUSTOMER supplies these)
export const listMyProducts = () => client.get("/products/mine").then((r) => r.data);
export const listAllProducts = () => client.get("/products").then((r) => r.data);
export const createProduct = (product) => client.post("/products", product).then((r) => r.data);

// Pricing
export const getQuote = (payload) => client.post("/pricing/quote", payload).then((r) => r.data);
export const listPricingPlans = () => client.get("/pricing/plans").then((r) => r.data);
export const createPricingPlan = (plan) => client.post("/pricing/plans", plan).then((r) => r.data);
export const updatePricingPlan = (id, plan) => client.put(`/pricing/plans/${id}`, plan).then((r) => r.data);
export const deletePricingPlan = (id) => client.delete(`/pricing/plans/${id}`).then((r) => r.data);

// Rental orders (CUSTOMER)
export const createRentalOrder = (payload) => client.post("/rental-orders", payload).then((r) => r.data);
export const listMyRentalOrders = () => client.get("/rental-orders/mine").then((r) => r.data);
export const listAllRentalOrders = () => client.get("/rental-orders").then((r) => r.data);
export const getPickupTaskForOrder = (orderId) =>
  client.get(`/rental-orders/${orderId}/pickup-task`).then((r) => r.data);

// Pickup tasks (DRIVER + WAREHOUSE_MANAGER/ADMIN)
export const listMyPickupTasks = () => client.get("/pickup-tasks/mine").then((r) => r.data);
export const listAllPickupTasks = () => client.get("/pickup-tasks").then((r) => r.data);
export const acceptPickupTask = (id) => client.post(`/pickup-tasks/${id}/accept`).then((r) => r.data);
export const rejectPickupTask = (id) => client.post(`/pickup-tasks/${id}/reject`).then((r) => r.data);
export const completePickupTask = (id) => client.post(`/pickup-tasks/${id}/complete`).then((r) => r.data);
export const reassignPickupTask = (id, driverId) =>
  client.post(`/pickup-tasks/${id}/reassign`, { driverId: driverId || null }).then((r) => r.data);
