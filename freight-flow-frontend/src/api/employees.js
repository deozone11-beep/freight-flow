import client from "./client";

export const getEmployees = () => client.get("/employees").then((res) => res.data);

export const createEmployee = (employee) =>
  client.post("/employees", employee).then((res) => res.data);

export const updateEmployee = (id, employee) =>
  client.put(`/employees/${id}`, employee).then((res) => res.data);

export const deleteEmployee = (id) => client.delete(`/employees/${id}`);
