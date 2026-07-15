import client from "./client";

export const getCaptcha = () =>
  client.get("/auth/captcha").then((res) => res.data);

export const login = (username, password, captchaId, captchaAnswer) =>
  client
    .post("/auth/login", { username, password, captchaId, captchaAnswer })
    .then((res) => res.data);

export const register = (payload) =>
  client.post("/auth/register", payload).then((res) => res.data);

export const getCurrentUser = () => client.get("/auth/me").then((res) => res.data);

export const changePassword = (currentPassword, newPassword) =>
  client
    .post("/auth/change-password", { currentPassword, newPassword })
    .then((res) => res.data);

export const forgotPassword = (email) =>
  client.post("/auth/forgot-password", { email }).then((res) => res.data);

export const resetPassword = (token, newPassword) =>
  client.post("/auth/reset-password", { token, newPassword }).then((res) => res.data);
