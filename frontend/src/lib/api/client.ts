"use client";

import axios from "axios";

let accessToken = "";

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const refreshed = await api.post("/auth/refresh");
      setAccessToken(refreshed.data.accessToken);
      error.config.headers = error.config.headers || {};
      error.config.headers.Authorization = `Bearer ${refreshed.data.accessToken}`;
      return api(error.config);
    }

    return Promise.reject(error);
  }
);
