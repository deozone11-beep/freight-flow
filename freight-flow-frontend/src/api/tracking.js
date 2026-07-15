import client from "./client";

export const pingLocation = (trackingId, latitude, longitude) =>
  client.post(`/tracking/${trackingId}/location`, { latitude, longitude }).then((r) => r.data);

export const getLiveLocation = (trackingId) =>
  client.get(`/tracking/${trackingId}`).then((r) => r.data);
