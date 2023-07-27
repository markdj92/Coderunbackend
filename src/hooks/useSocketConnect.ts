import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATH_ROUTE, USER_NICKNAME_KEY, USER_TOKEN_KEY } from '@/constants';
import { getNickname, getUserToken } from '@/utils';

import { attempt, socket } from '@/apis/socketApi';

const useSocketConnect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket.connected) {
      const userToken = getUserToken();
      const nickname = getNickname();
      if (!!userToken && !!nickname) {
        socket.io.opts.extraHeaders = {
          Authorization: userToken,
        };
        socket.connect();
        navigate(PATH_ROUTE.lobby, { state: { nickname } });
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
          localStorage.removeItem(USER_NICKNAME_KEY);
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
