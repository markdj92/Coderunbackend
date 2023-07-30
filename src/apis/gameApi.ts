import axios from 'axios';

import { PATH_API, USER_TOKEN_KEY } from '@/constants';
import { getUserToken } from '@/utils';

import { ExecuteData } from '@/types/inGame';

const axiosConfig = {
  // baseURL: `http://localhost:3000${PATH_API.codingtest}`,
  baseURL: `http://52.69.242.42:3000${PATH_API.codingtest}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const gameInstance = axios.create(axiosConfig);

export const postExecuteResult = (executeData: ExecuteData) => {
  return gameInstance.post(PATH_API.execute, executeData);
};

export const postQuizInfo = (title: string) => {
  return gameInstance.post('', { title });
};

gameInstance.interceptors.request.use(
  (config) => {
    config.headers[USER_TOKEN_KEY] = getUserToken();
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  },
);
