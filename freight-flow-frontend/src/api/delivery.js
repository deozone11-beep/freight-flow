import client from "./client";

// Warehouses
export const listWarehouses = () => client.get("/warehouses").then((r) => r.data);
export const createWarehouse = (payload) => client.post("/warehouses", payload).then((r) => r.data);
export const updateWarehouse = (id, payload) => client.put(`/warehouses/${id}`, payload).then((r) => r.data);

// Warehouse stock
export const listWarehouseStock = (warehouseId) =>
  client.get("/warehouse-stock", { params: warehouseId ? { warehouseId } : {} }).then((r) => r.data);

// Drivers
export const listDrivers = (warehouseId) =>
  client.get("/drivers", { params: warehouseId ? { warehouseId } : {} }).then((r) => r.data);
export const getMyDriverProfile = () => client.get("/drivers/me").then((r) => r.data);
export const setDriverStatus = (status) => client.post("/drivers/me/status", { status }).then((r) => r.data);
export const setDriverHomeWarehouse = (warehouseId) =>
  client.post("/drivers/me/home-warehouse", { warehouseId }).then((r) => r.data);

// Delivery requests (COMPANY)
export const createDeliveryRequest = (payload) => client.post("/delivery-requests", payload).then((r) => r.data);
export const listMyDeliveryRequests = () => client.get("/delivery-requests/mine").then((r) => r.data);
export const listAllDeliveryRequests = () => client.get("/delivery-requests").then((r) => r.data);
export const listDeliveryRequestsAssignedToMe = () =>
  client.get("/delivery-requests/assigned-to-me").then((r) => r.data);
export const assignDeliveryDriver = (id, driverId) =>
  client.post(`/delivery-requests/${id}/assign-driver`, { driverId: driverId || null }).then((r) => r.data);
export const setManualDeliveryCharge = (id, amount) =>
  client.post(`/delivery-requests/${id}/manual-charge`, { amount }).then((r) => r.data);
export const markPickedUp = (id) => client.post(`/delivery-requests/${id}/picked-up`).then((r) => r.data);
export const markOutForDelivery = (id) => client.post(`/delivery-requests/${id}/out-for-delivery`).then((r) => r.data);
export const markDelivered = (id) => client.post(`/delivery-requests/${id}/delivered`).then((r) => r.data);
