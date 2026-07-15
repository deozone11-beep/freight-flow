import client from "./client";

export const getInternationalShipments = () =>
  client.get("/international-shipments").then((res) => res.data);

export const createInternationalShipment = (importItem) =>
  client.post("/international-shipments", importItem).then((res) => res.data);

export const updateInternationalShipment = (id, importItem) =>
  client.put(`/international-shipments/${id}`, importItem).then((res) => res.data);

export const deleteInternationalShipment = (id) =>
  client.delete(`/international-shipments/${id}`);
