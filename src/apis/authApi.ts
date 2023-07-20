import axios from 'axios';

import { USER_TOKEN_KEY, PATH_API } from '@/constants';

import { UserAccount } from '@/types/auth';

const axiosConfig = {
  baseURL: `http://52.69.242.42:3000${PATH_API.auth}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const loginInstance = axios.create(axiosConfig);

export const postSignUp = (userAccount: UserAccount | { [k: string]: string }) => {
  return loginInstance.post(PATH_API.signUp, userAccount);
};

export const postLogin = (userAccount: UserAccount | { [k: string]: string }) => {
  // return { data: { token: userAccount.email } };
  return loginInstance.post(PATH_API.login, userAccount);
};

export const postLogout = () => {
  localStorage.removeItem(USER_TOKEN_KEY);
  // return loginInstance.get(PATH_API.logout);
};
