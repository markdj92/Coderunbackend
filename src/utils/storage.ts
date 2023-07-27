import { USER_NICKNAME_KEY, USER_TOKEN_KEY } from '@/constants';

export const getUserToken = (): string | null => {
  const userToken = localStorage.getItem(USER_TOKEN_KEY);
  return userToken ? `Bearer ${userToken}` : null;
};

export const getNickname = (): string | null => {
  const nickname = localStorage.getItem(USER_NICKNAME_KEY);
  return nickname ? nickname : null;
};
