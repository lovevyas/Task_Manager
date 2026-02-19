import { api, setAccessToken } from "./client";

export const loginRequest = async (payload: { email: string; password: string }) => {
  const { data } = await api.post("/auth/login", payload);
  setAccessToken(data.accessToken);
  return data;
};

export const registerRequest = async (payload: { name: string; email: string; password: string }) => {
  const { data } = await api.post("/auth/register", payload);
  setAccessToken(data.accessToken);
  return data;
};

export const restoreSession = async () => {
  const { data } = await api.post("/auth/refresh");
  setAccessToken(data.accessToken);
  return data;
};

export const logoutRequest = async () => {
  await api.post("/auth/logout");
  setAccessToken("");
};
