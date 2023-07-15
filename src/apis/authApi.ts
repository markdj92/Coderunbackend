import axios from 'axios';

import { USER_TOKEN_KEY, PATH_API } from '@/constants';

import { UserAccount } from '@/types/auth';

const axiosConfig = {
  baseURL: `${import.meta.env.VITE_API_URL}${PATH_API.auth}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const loginInstance = axios.create(axiosConfig);

export const postSignUp = (userAccount: UserAccount) => {
  return loginInstance.post(PATH_API.signUp, userAccount);
};

export const postLogin = (userAccount: UserAccount) => {
  return loginInstance.post(PATH_API.login, userAccount);
};

export const postSignOut = () => {
  localStorage.removeItem(USER_TOKEN_KEY);
};
