import { redirect } from 'react-router-dom';

import { USER_TOKEN_KEY } from '@/constants';
import { PATH_ROUTE, PATH_API } from '@/constants';

import { roomInstance } from '@/apis/roomApi';

export const lobbyLoader = () => {
  const userToken = localStorage.getItem(USER_TOKEN_KEY);
  if (!userToken) {
    return redirect(PATH_ROUTE.login);
  }
  return;
  // return roomInstance.get(PATH_API.root);
};
