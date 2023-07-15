import axios from 'axios';

import { PATH_API } from '@/constants';
import { getUserToken } from '@/utils';

const axiosConfig = {
  baseURL: `${import.meta.env.VITE_API_URL}${PATH_API.room}`,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const roomInstance = axios.create(axiosConfig);

roomInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = getUserToken();
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  },
);
