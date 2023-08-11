import { io } from 'socket.io-client';

import { PATH_API } from '@/constants';

export const attempt = {
  maxCount: 5,
  tryCount: 0,
};

export const socket = io(`http://52.69.242.42:3000${PATH_API.room}`, {
  // export const socket = io(`http://localhost:3000${PATH_API.room}`, {
  extraHeaders: {},
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: attempt.maxCount,
});

// export const webRtcSocketIo = io(`http://localhost:3000${PATH_API.voice}`, {
export const webRtcSocketIo = io(`http://52.69.242.42:3000${PATH_API.voice}`, {
  autoConnect: false,
  withCredentials: true,
  reconnectionAttempts: attempt.maxCount,
});
