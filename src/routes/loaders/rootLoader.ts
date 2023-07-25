import { redirect } from 'react-router-dom';

import { PATH_ROUTE } from '@/constants';
import { getUserToken } from '@/utils';

export const rootLoader = () => {
  const userToken = getUserToken();
  if (userToken) {
    return null;
  }
  return redirect(PATH_ROUTE.login);
};
