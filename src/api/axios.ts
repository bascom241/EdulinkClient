import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const axiosInstance = axios.create({
  baseURL,
});

const publicUrls = [
  "/auth/login",
  "/auth/register",
  "/auth/login-with-token",
  "/auth/verify-login",
];

const formatRetryAfter = (seconds?: number) => {
  if (!seconds || seconds < 1) return "soon";
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;

  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
};

const normalizeRateLimitError = (error: any) => {
  const retryAfterHeader = error?.response?.headers?.["retry-after"];
  const retryAfterFromBody = error?.response?.data?.retryAfter;
  const retryAfter = Number(retryAfterFromBody || retryAfterHeader || 0);
  const message =
    error?.response?.data?.message ||
    "You are doing that too quickly. Please wait before trying again.";

  error.isRateLimited = true;
  error.retryAfter = retryAfter;
  error.userMessage = `${message} Try again in ${formatRetryAfter(retryAfter)}.`;

  return error;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const isPublicRoute = publicUrls.some((url) => config.url?.includes(url));

    if (!isPublicRoute) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    if (error?.response?.status === 429) {
      return Promise.reject(normalizeRateLimitError(error));
    }

    const isPublicRoute = publicUrls.some((url) =>
      originalRequest.url?.includes(url)
    );

    if (isPublicRoute) {
      return Promise.reject(error);
    }

    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.status === 403 ||
        error.response.data.message === "jwt expired") &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = "Bearer " + token;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = res.data.data.accessToken;
        const newRefreshToken = res.data.data.refreshToken;

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        axiosInstance.defaults.headers.Authorization =
          "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
