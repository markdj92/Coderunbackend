import { io } from 'socket.io-client';

import { PATH_API } from '@/constants';

export const socket = io(`http://43.206.213.192:3000${PATH_API.room}`);
