export const setupAxiosInterceptors = (axiosInstance, logout) => {
    axiosInstance.interceptors.response.use(
        res => res,
        err => {
            if (err.response?.status === 401) {
                console.warn('[axiosInterceptor] Unauthorized → logging out');
                logout();
            }
            return Promise.reject(err);
        }
    );
};
