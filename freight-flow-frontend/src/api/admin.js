import client from "./client";

export const listCustomers = () => client.get("/admin/customers").then((response) => response.data);
