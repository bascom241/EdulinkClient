import axios from "axios";


const localUrl = "http://localhost:3000/api/v1"
console.log(localUrl)
const deployedUrl = "https://edlinkserver.onrender.com"
const axiosInstance = axios.create({
  baseURL:deployedUrl
});

const publicUrls = [
  "/auth/login",
  "/auth/register",
  "/auth/login-with-token",
  "/auth/verify-login"
];

// 🔹 REQUEST INTERCEPTOR (attach access token)
axiosInstance.interceptors.request.use(
  (config) => {
    const isPublicRoute = publicUrls.some((url) =>
      config.url?.includes(url)
    );

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
let failedQueue: any  = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom:any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};


// 🔹 RESPONSE INTERCEPTOR (handle expired token)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isPublicRoute = publicUrls.some((url) =>
      originalRequest.url?.includes(url)
    );

    // ❌ Don't try refresh for public routes
    if (isPublicRoute) {
      return Promise.reject(error);
    }

    // 🔐 If token expired
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403 || error.response.data.message === "jwt expired") &&
      !originalRequest._retry
    ) {
      // 🔁 If already refreshing → queue request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // 🚨 Use plain axios (not axiosInstance)
        const res = await axios.post(
          "http://localhost:3000/api/v1/auth/refresh",
          { refreshToken }
        );

       


        const newAccessToken = res.data.data.accessToken;
        const newRefreshToken = res.data.data.refreshToken

        // 💾 Save new token
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken)

        // 🔁 Update default header
        axiosInstance.defaults.headers.Authorization =
          "Bearer " + newAccessToken;

        // 🔓 Release queued requests
        processQueue(null, newAccessToken);

        // 🔁 Retry original request
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // 🚪 Logout user
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