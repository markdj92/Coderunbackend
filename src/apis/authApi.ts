import axios from 'axios';

import { USER_TOKEN_KEY, PATH_API } from '@/constants';
import { getUserToken } from '@/utils';

import { socket } from './socketApi';

import { UserAccount, UserEmail } from '@/types/auth';

const axiosConfig = {
  // baseURL: `http://localhost:3000${PATH_API.auth}`,
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
export const postCheckEmail = (userEmail: UserEmail | { [k: string]: string }) => {
  return loginInstance.post(PATH_API.checkEmail, userEmail);
};

export const postLogin = (userAccount: UserAccount | { [k: string]: string }) => {
  return loginInstance.post(PATH_API.login, userAccount);
};

export const setInitName = (nickname: string, accessToken: string) => {
  return loginInstance.put(
    PATH_API.nickname,
    {
      nickname,
    },
    {
      headers: {
        [USER_TOKEN_KEY]: 'Bearer ' + accessToken,
      },
    },
  );
};

export const postLogout = () => {
  const userToken = getUserToken();
  loginInstance
    .post(
      PATH_API.logout,
      {},
      {
        headers: {
          [USER_TOKEN_KEY]: userToken,
        },
      },
    )
    .then(() => {
      socket.io.opts.extraHeaders = {};
      if (socket.connected) socket.disconnect();
    });
};
