import { USER_TOKEN_KEY } from '@/constants';

export const getUserToken = (): string | null => {
  const userToken = localStorage.getItem(USER_TOKEN_KEY);
  return userToken ? `Bearer ${userToken}` : null;
};
