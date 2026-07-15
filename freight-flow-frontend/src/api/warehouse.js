import client from "./client";

export const getWarehouseRegions = () =>
  client.get("/warehouse").then((res) => res.data);

export const createWarehouseRegion = (region) =>
  client.post("/warehouse", region).then((res) => res.data);

export const updateWarehouseRegion = (id, region) =>
  client.put(`/warehouse/${id}`, region).then((res) => res.data);

export const deleteWarehouseRegion = (id) => client.delete(`/warehouse/${id}`);
