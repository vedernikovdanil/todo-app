import axios, { AxiosError } from "axios";
import { StoreContextType } from "..";

const $axios = axios.create({
  withCredentials: true,
  baseURL: "api",
});

export function setupInterceptors(store: StoreContextType) {
  $axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  });

  $axios.interceptors.response.use(
    (config) => config,
    async (error) => {
      if (error instanceof AxiosError) {
        const originalRequest = error.config;
        switch (error.response?.status) {
          case 401: {
            if (error.response.config.url !== "/refresh") {
              if (localStorage.getItem("token")) {
                await store.auth.checkAuth();
                const response = await $axios.request(originalRequest!);
                if (response.status !== 401) {
                  return response;
                }
              }
            }
            window.location.replace("/login");
            break;
          }
          default: {
            store.error.setError(error?.response?.data);
          }
        }
      }
    }
  );
}

export default $axios;
