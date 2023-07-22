import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATH_ROUTE } from '@/constants';

import { postLogout } from '@/apis/authApi';
import { attempt, socket } from '@/apis/socketApi';

const useSocketConnect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('connect', () => {
      attempt.tryCount = 0;
      socket.off('connect_error');
    });
    socket.on('disconnect', () => {
      socket.on('connect_error', () => {
        attempt.tryCount += 1;
        if (attempt.tryCount > attempt.maxCount - 1) {
          postLogout();
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
