import axios from "axios";
import { API_BASE_URL } from "../config";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};

    (config.headers as any).Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
