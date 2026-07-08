// lib/api.ts
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// request interceptor: tambah Authorization jika token ada di localStorage
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// response interceptor: jika 401 -> hapus token dan redirect ke /login
api.interceptors.response.use(
  (resp: AxiosResponse) => resp,
  (error: unknown) => {
    const axiosError = error as {
      response?: { status?: number; config?: { url?: string } };
      config?: { url?: string };
    };
    const status = axiosError?.response?.status;
    const requestUrl = axiosError?.response?.config?.url || axiosError?.config?.url || "";
    const isLoginRequest = requestUrl.includes("/auth/login");

    // Jangan redirect otomatis ketika login gagal agar pesan error bisa ditampilkan di form.
    if (status === 401 && !isLoginRequest) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // pakai replace supaya tidak menumpuk history
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
