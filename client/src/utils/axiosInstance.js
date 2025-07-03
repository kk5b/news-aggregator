import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api',
});

// This interceptor correctly adds the auth token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;