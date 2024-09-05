import axios from 'axios';
import { parseCookies } from 'nookies';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001'
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = parseCookies().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }
)
