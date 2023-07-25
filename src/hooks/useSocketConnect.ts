import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATH_ROUTE, USER_TOKEN_KEY } from '@/constants';
import { getUserToken } from '@/utils';

import { attempt, socket } from '@/apis/socketApi';

const useSocketConnect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket.connected) {
      const userToken = getUserToken();
      if (!!userToken) {
        socket.io.opts.extraHeaders = {
          Authorization: userToken,
        };
        socket.connect();
        navigate(PATH_ROUTE.lobby);
      }
    }
    socket.on('connect', () => {
      attempt.tryCount = 0;
      socket.off('connect_error');
    });
    socket.on('disconnect', () => {
      socket.on('connect_error', () => {
        attempt.tryCount += 1;
        if (attempt.tryCount > attempt.maxCount - 1) {
          localStorage.removeItem(USER_TOKEN_KEY);
          navigate(PATH_ROUTE.login);
        }
      });
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [navigate]);
};

export default useSocketConnect;
