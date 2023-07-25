import { redirect } from 'react-router-dom';

import { PATH_ROUTE } from '@/constants';
import { getUserToken } from '@/utils';

export const lobbyLoader = () => {
  const userToken = getUserToken();
  if (!userToken) {
    return redirect(PATH_ROUTE.login);
  }
  return;
};
