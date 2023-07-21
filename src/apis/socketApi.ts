import { io } from 'socket.io-client';

import { PATH_API } from '@/constants';

export const socket = io(`http://52.69.242.42:3000${PATH_API.room}`, {
  extraHeaders: {},
  autoConnect: false,
});
