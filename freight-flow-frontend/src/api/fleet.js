import client from "./client";

export const getFleet = () => client.get("/fleet").then((res) => res.data);

export const createVehicle = (vehicle) =>
  client.post("/fleet", vehicle).then((res) => res.data);

export const updateVehicle = (id, vehicle) =>
  client.put(`/fleet/${id}`, vehicle).then((res) => res.data);

export const deleteVehicle = (id) => client.delete(`/fleet/${id}`);
