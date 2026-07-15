import client from "./client";

export const getDomesticShipments = () =>
  client.get("/domestic-shipments").then((res) => res.data);

export const createDomesticShipment = (dispatch) =>
  client.post("/domestic-shipments", dispatch).then((res) => res.data);

export const updateDomesticShipment = (id, dispatch) =>
  client.put(`/domestic-shipments/${id}`, dispatch).then((res) => res.data);

export const deleteDomesticShipment = (id) =>
  client.delete(`/domestic-shipments/${id}`);
