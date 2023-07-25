import { redirect } from 'react-router-dom';

import { PATH_ROUTE } from '@/constants';
import { getUserToken } from '@/utils';

export const authLoader = () => {
  const userToken = getUserToken();
  if (userToken) {
    return redirect(PATH_ROUTE.lobby);
  }
  return null;
};
